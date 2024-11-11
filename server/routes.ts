import type { Express } from "express";
import { z } from "zod";
import axios from "axios";

const countryNameToCode: Record<string, string> = {
  'CANADA': 'CA',
  'USA': 'US',
  'UNITED STATES': 'US',
  'UK': 'GB',
  'GREAT BRITAIN': 'GB',
  'ENGLAND': 'GB',
  'AUSTRALIA': 'AU',
  'NEW ZEALAND': 'NZ',
  'FRANCE': 'FR',
  'GERMANY': 'DE',
  'ITALY': 'IT',
  'SPAIN': 'ES',
  'JAPAN': 'JP',
  'CHINA': 'CN',
  'INDIA': 'IN'
};

const urlStore = new Map<string, {
  status: 'up' | 'down';
  lastChecked: string;
  responseTime: number;
}>();

export function registerRoutes(app: Express) {
  app.get("/api/weather", async (req, res) => {
    try {
      const location = req.query.location as string;
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }

      // Parse location into city and country with proper code mapping
      const [city, countryName] = location.split(',').map(part => part.trim());
      const countryCode = countryName 
        ? (countryNameToCode[countryName.toUpperCase()] || countryName.toUpperCase()) 
        : undefined;
      const geocodingUrl = countryCode
        ? `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&country=${countryCode}&count=10`
        : `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10`;

      // Add logging before geocoding API call
      console.log('Location parsing:', {
        rawLocation: location,
        city,
        countryName,
        countryCode,
        geocodingUrl
      });

      // Get coordinates from the geocoding API
      const geocodingResponse = await axios.get(geocodingUrl);

      // Process geocoding response
      const results = geocodingResponse.data.results;
      let selectedLocation = null;

      // Add logging after geocoding response
      console.log('Geocoding response:', {
        results,
        countryCode,
        countryName
      });

      if (results && results.length > 0) {
        if (countryCode) {
          // If country code specified, find matching result
          selectedLocation = results.find(
            loc => loc.country_code.toUpperCase() === countryCode.toUpperCase()
          );
        } else {
          // If no country specified, use first result
          selectedLocation = results[0];
        }
      }

      if (!selectedLocation) {
        return res.status(404).json({ 
          error: countryCode 
            ? `${city} not found in ${countryName}` 
            : "Location not found" 
        });
      }

      // Log selected location
      console.log('Selected location:', selectedLocation);

      const { latitude, longitude, name, country: resultCountry } = selectedLocation;

      // Then, get weather data using the coordinates with the updated parameters
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,relative_humidity_2m&temperature_unit=celsius`
      );

      const weatherData = {
        location: {
          name,
          country: resultCountry,
          latitude,
          longitude,
        },
        current: {
          temperature: weatherResponse.data.current_weather.temperature,
          apparentTemperature: weatherResponse.data.current_weather.temperature,
          weathercode: weatherResponse.data.current_weather.weathercode,
          relativeHumidity: weatherResponse.data.hourly.relative_humidity_2m[0],
        },
      };

      const outfit = getOutfitRecommendation(
        weatherData.current.temperature,
        weatherData.current.weathercode
      );

      res.json({ ...weatherData, outfit });
    } catch (error: any) {
      console.error('Weather API Error:', {
        error: error?.message,
        location: req.query.location,
        response: error?.response?.data
      });
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  app.post("/api/monitor", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      urlStore.set(url, {
        status: 'up',
        lastChecked: new Date().toISOString(),
        responseTime: 0
      });

      checkUrl(url);
      res.json({ message: "URL added to monitoring" });
    } catch (error) {
      res.status(500).json({ error: "Failed to add URL" });
    }
  });

  app.get("/api/monitor", (req, res) => {
    const statuses = Array.from(urlStore.entries()).map(([url, status]) => ({
      url,
      ...status
    }));
    res.json(statuses);
  });
}

async function checkUrl(url: string) {
  try {
    const start = Date.now();
    await axios.get(url);
    const responseTime = Date.now() - start;

    urlStore.set(url, {
      status: 'up',
      lastChecked: new Date().toISOString(),
      responseTime
    });
  } catch (error) {
    urlStore.set(url, {
      status: 'down',
      lastChecked: new Date().toISOString(),
      responseTime: 0
    });
  }
}

function getOutfitRecommendation(temp: number, weatherCode: number) {
  // Map weather codes to conditions
  const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weatherCode);
  const isSnowy = [71, 73, 75, 77, 85, 86].includes(weatherCode);
  const isClear = [0, 1].includes(weatherCode);
  const isCloudy = [2, 3].includes(weatherCode);

  if (isRainy) {
    return {
      top: "Waterproof jacket",
      bottom: "Water-resistant pants",
      accessories: ["Umbrella", "Waterproof shoes"],
      description: "Rain protection gear"
    };
  } else if (isSnowy) {
    return {
      top: "Insulated winter coat",
      bottom: "Snow pants",
      accessories: ["Winter boots", "Warm hat", "Gloves", "Scarf"],
      description: "Snow protection gear"
    };
  } else if ((isClear || isCloudy) && temp > 25) {
    return {
      top: "T-shirt",
      bottom: "Shorts",
      accessories: ["Sunglasses", "Hat"],
      description: "Light and cool outfit for hot weather"
    };
  } else if ((isClear || isCloudy) && temp > 15) {
    return {
      top: "Light sweater",
      bottom: "Jeans",
      accessories: ["Light jacket"],
      description: "Comfortable outfit for mild weather"
    };
  } else {
    return {
      top: "Warm sweater",
      bottom: "Warm pants",
      accessories: ["Coat", "Scarf", "Gloves"],
      description: "Warm outfit for cold weather"
    };
  }
}

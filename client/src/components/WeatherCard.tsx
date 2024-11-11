import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { WeatherData, getWeatherDescription } from "../types/weather";

interface WeatherCardProps {
  weatherData: WeatherData;
}

export function WeatherCard({ weatherData }: WeatherCardProps) {
  const [bgClass, setBgClass] = useState("bg-blue-50");

  useEffect(() => {
    const weathercode = weatherData.current.weathercode;
    const temp = weatherData.current.temperature;

    // Rain codes: 51-55, 61-65, 80-82
    const isRainy = [51, 53, 55, 61, 63, 65, 80, 81, 82].includes(weathercode);
    // Snow codes: 71-77, 85-86
    const isSnowy = [71, 73, 75, 77, 85, 86].includes(weathercode);
    // Clear sky: 0
    const isClear = weathercode === 0;

    if (isRainy) {
      setBgClass("bg-slate-200");
    } else if (isSnowy) {
      setBgClass("bg-blue-50");
    } else if (isClear && temp > 20) {
      setBgClass("bg-yellow-50");
    } else {
      setBgClass("bg-blue-50");
    }
  }, [weatherData]);

  return (
    <Card className={`w-full transition-colors duration-500 ${bgClass}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{`${weatherData.location.name}, ${weatherData.location.country}`}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-4xl font-bold">
            {Math.round(weatherData.current.temperature)}°C
          </p>
          <p className="text-gray-600">
            Feels like: {Math.round(weatherData.current.apparentTemperature)}°C
          </p>
          <p className="text-gray-600">
            {getWeatherDescription(weatherData.current.weathercode)}
          </p>
          <p className="text-gray-600">
            Humidity: {weatherData.current.relativeHumidity}%
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
import { WeatherCard } from "../components/WeatherCard";
import { OutfitRecommendationCard } from "../components/OutfitRecommendation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "wouter";

const formSchema = z.object({
  location: z.string().min(2, "Location must be at least 2 characters"),
});

export function Home() {
  const [searchLocation, setSearchLocation] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
    },
  });

  const { data: weatherData, error } = useSWR(
    searchLocation ? `/api/weather?location=${encodeURIComponent(searchLocation)}` : null
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setSearchLocation(values.location);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Weather & Outfit Recommendations</h1>
        <Link href="/monitor">
          <Button variant="outline">URL Monitor</Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city (e.g., London or London, GB)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-8">
              Get Weather
            </Button>
          </div>
        </form>
      </Form>

      {error && (
        <div className="text-red-500 mb-4">
          Error fetching weather data. Please try again.
        </div>
      )}

      {weatherData && (
        <div className="grid gap-8 md:grid-cols-2">
          <WeatherCard weatherData={weatherData} />
          <OutfitRecommendationCard outfit={weatherData.outfit} />
        </div>
      )}
    </div>
  );
}
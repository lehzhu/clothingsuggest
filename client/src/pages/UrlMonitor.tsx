import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWR from "swr";
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
import { UrlMonitoringCard } from "../components/UrlMonitoringCard";
import { Link } from "wouter";

const formSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
});

export function UrlMonitor() {
  const [urls, setUrls] = useState<string[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { data: monitoringData, mutate } = useSWR(
    urls.length > 0 ? "/api/monitor" : null,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  );

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await fetch("/api/monitor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: values.url }),
      });
      setUrls([...urls, values.url]);
      form.reset();
      mutate();
    } catch (error) {
      console.error("Error adding URL:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">URL Monitor</h1>
        <Link href="/">
          <Button variant="outline">Weather & Outfits</Button>
        </Link>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>URL to Monitor</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-8">
              Add URL
            </Button>
          </div>
        </form>
      </Form>

      <div className="grid gap-4">
        {monitoringData?.map((status: any) => (
          <UrlMonitoringCard key={status.url} status={status} />
        ))}
      </div>
    </div>
  );
}

import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const urlMonitors = pgTable("url_monitors", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  url: text("url").notNull(),
  status: text("status").notNull(),
  lastChecked: timestamp("last_checked").notNull(),
  responseTime: integer("response_time").notNull(),
});

export const insertUrlMonitorSchema = createInsertSchema(urlMonitors);
export const selectUrlMonitorSchema = createSelectSchema(urlMonitors);
export type InsertUrlMonitor = z.infer<typeof insertUrlMonitorSchema>;
export type UrlMonitor = z.infer<typeof selectUrlMonitorSchema>;

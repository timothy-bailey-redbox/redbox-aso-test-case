import { z } from "zod";
import { TimestampSchema } from "~/types/generic";
import { type WidgetDataAxes } from "~/types/widgetData";

export const StatsStorePerformanceTrafficSourceSchema = z.object({
    date: TimestampSchema,
    package_name: z.string(),
    traffic_source: z.string(),
    search_term: z.string(),
    utm_source: z.string(),
    utm_campaign: z.string(),
    store_listing_acquisitions: z.number(),
    store_listing_visitors: z.number(),
    store_listing_conversion_rate: z.number(),
});
export type StatsStorePerformanceTrafficSource = z.infer<typeof StatsStorePerformanceTrafficSourceSchema>;

export const StatsStorePerformanceTrafficSourceQuerySchema = z.object({
    appId: z.string(),
    keywords: z.array(z.string().min(1)),
    from: TimestampSchema,
    to: TimestampSchema,
});
export type StatsStorePerformanceTrafficSourceQuery = z.infer<typeof StatsStorePerformanceTrafficSourceQuerySchema>;

export const StatsStorePerformanceTrafficSourceDetails: Record<
    keyof StatsStorePerformanceTrafficSource,
    WidgetDataAxes
> = {
    date: { name: "Date", aggregate: "min", format: "date" },
    search_term: { name: "Search term", aggregate: "count", format: "string" },
    traffic_source: { name: "Traffic source", aggregate: "count", format: "string" },
    utm_campaign: { name: "Campaign", aggregate: "count", format: "string" },
    utm_source: { name: "Source", aggregate: "count", format: "string" },
    package_name: { name: "App id", aggregate: "none", format: "appId" },
    store_listing_acquisitions: { name: "Acquisitions", aggregate: "sum", format: "number" },
    store_listing_conversion_rate: { name: "Conversion rate", aggregate: "avg", format: "percent" },
    store_listing_visitors: { name: "Visitors", aggregate: "sum", format: "number" },
};

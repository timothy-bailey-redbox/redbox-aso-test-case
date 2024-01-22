import { TimestampSchema } from "types/generic";
import { z } from "zod";

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

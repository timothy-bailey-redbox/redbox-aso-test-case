import { TimestampSchema } from "types/generic";
import { z } from "zod";

export const StatsStorePerformanceCountrySchema = z.object({
    date: TimestampSchema,
    package_name: z.string(),
    country_region: z.string(),
    store_listing_acquisitions: z.number(),
    store_listing_visitors: z.number(),
    store_listing_conversion_rate: z.number(),
});
export type StatsStorePerformanceCountry = z.infer<typeof StatsStorePerformanceCountrySchema>;

export const StatsStorePerformanceCountryQuerySchema = z.object({
    appId: z.string(),
    country: z.array(z.string().min(1)),
    from: TimestampSchema,
    to: TimestampSchema,
});
export type StatsStorePerformanceCountryQuery = z.infer<typeof StatsStorePerformanceCountryQuerySchema>;

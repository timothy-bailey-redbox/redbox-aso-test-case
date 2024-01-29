import { TimestampSchema } from "types/generic";
import { type WidgetDataAxes } from "types/widgetData";
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

export const StatsStorePerformanceCountryDetails: Record<keyof StatsStorePerformanceCountry, WidgetDataAxes> = {
    date: { name: "Date", aggregate: "min", format: "date" },
    country_region: { name: "Country", aggregate: "count", format: "countryCode" },
    package_name: { name: "App", aggregate: "none", format: "appId" },
    store_listing_acquisitions: { name: "Acquisitions", aggregate: "sum", format: "number" },
    store_listing_conversion_rate: { name: "Conversion rate", aggregate: "avg", format: "percent" },
    store_listing_visitors: { name: "Visitors", aggregate: "sum", format: "number" },
};

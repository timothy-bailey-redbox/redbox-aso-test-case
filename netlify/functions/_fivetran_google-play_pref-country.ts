import { type Config } from "@netlify/functions";
import fivetranDb from "netlify/lib/db/fivetranDb";
import functionHandler from "netlify/lib/handler";
import { parseQueryString, parseWithSchema } from "netlify/lib/parser";
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
    country: z.array(z.string().min(1)).nonempty(),
    from: TimestampSchema,
    to: TimestampSchema,
});
export type StatsStorePerformanceCountryQuery = z.infer<typeof StatsStorePerformanceCountryQuerySchema>;

export const config: Config = {
    path: "/api/fivetran/google-play/stats-store-performance-country",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req) => {
            const query = parseQueryString(req);
            const params = parseWithSchema(
                {
                    appId: query.appId,
                    country: query.country?.split(","),
                    from: parseInt(query.from ?? "", 10),
                    to: parseInt(query.to ?? "", 10),
                },
                StatsStorePerformanceCountryQuerySchema,
            );

            const results = await fivetranDb.select<StatsStorePerformanceCountry>(
                `SELECT
                    date,
                    package_name,
                    country_region,
                    store_listing_acquisitions,
                    store_listing_visitors,
                    store_listing_conversion_rate
                FROM google_play.stats_store_performance_country
                WHERE package_name = :appId
                AND country_region = ANY(:country)
                AND date BETWEEN :from AND :to`,
                {
                    ...params,
                    from: new Date(params.from),
                    to: new Date(params.to),
                },
            );

            return {
                body: results,
            };
        },
    },
});

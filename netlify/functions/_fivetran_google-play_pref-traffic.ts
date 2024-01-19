import { type Config } from "@netlify/functions";
import fivetranDb from "netlify/lib/db/fivetranDb";
import functionHandler from "netlify/lib/handler";
import { parseQueryString, parseWithSchema } from "netlify/lib/parser";
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

export const config: Config = {
    path: "/api/fivetran/google-play/stats-store-performance-traffic-source",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req) => {
            const query = parseQueryString(req);
            const params = parseWithSchema(
                {
                    appId: query.appId,
                    keywords: query.keywords?.split(",") ?? [],
                    from: parseInt(query.from ?? "", 10),
                    to: parseInt(query.to ?? "", 10),
                },
                StatsStorePerformanceTrafficSourceQuerySchema,
            );

            const results = await fivetranDb.select<StatsStorePerformanceTrafficSource>(
                `SELECT
                    date,
                    package_name,
                    traffic_source,
                    search_term,
                    utm_source,
                    utm_campaign,
                    store_listing_acquisitions,
                    store_listing_visitors,
                    store_listing_conversion_rate
                FROM google_play.stats_store_performance_traffic_source
                WHERE package_name = :appId
                AND search_term = ANY(:keywords)
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

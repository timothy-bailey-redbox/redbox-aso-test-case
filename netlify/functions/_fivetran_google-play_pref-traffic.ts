import fivetranDb from "netlify/lib/db/fivetranDb";
import functionHandler from "netlify/lib/handler";
import { parseQueryString, parseWithSchema } from "netlify/lib/parser";
import {
    StatsStorePerformanceTrafficSourceQuerySchema,
    type StatsStorePerformanceTrafficSource,
} from "types/fivetran/google-play/statsStorePerformanceTrafficSource";

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

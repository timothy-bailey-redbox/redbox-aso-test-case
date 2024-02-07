import {
    StatsStorePerformanceTrafficSourceQuerySchema,
    type StatsStorePerformanceTrafficSource,
} from "types/fivetran/google-play/statsStorePerformanceTrafficSource";
import fivetranDb from "~/api/db/fivetranDb";
import functionHandler from "~/api/handler";
import { parseQueryStringArray, parseQueryStringInt, parseWithSchema } from "~/api/parser";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req) => {
            console.log(req.query);

            const params = parseWithSchema(
                {
                    appId: req.query.appId,
                    keywords: parseQueryStringArray(req.query.keywords),
                    from: parseQueryStringInt(req.query.from),
                    to: parseQueryStringInt(req.query.to),
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

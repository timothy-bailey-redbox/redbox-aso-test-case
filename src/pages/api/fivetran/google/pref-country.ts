import {
    StatsStorePerformanceCountryQuerySchema,
    type StatsStorePerformanceCountry,
} from "types/fivetran/google-play/statsStorePerformanceCountry";
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
                    country: parseQueryStringArray(req.query.country),
                    from: parseQueryStringInt(req.query.from),
                    to: parseQueryStringInt(req.query.to),
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

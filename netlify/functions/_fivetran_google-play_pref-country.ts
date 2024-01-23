import fivetranDb from "netlify/lib/db/fivetranDb";
import functionHandler from "netlify/lib/handler";
import { parseQueryString, parseWithSchema } from "netlify/lib/parser";
import {
    StatsStorePerformanceCountryQuerySchema,
    type StatsStorePerformanceCountry,
} from "types/fivetran/google-play/statsStorePerformanceCountry";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req) => {
            const query = parseQueryString(req);
            const params = parseWithSchema(
                {
                    appId: query.appId,
                    country: query.country?.split(",") ?? [],
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

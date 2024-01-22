import { useQuery } from "react-query";
import { type DashboardAPI } from "types/dashboard";
import {
    StatsStorePerformanceCountrySchema,
    type StatsStorePerformanceCountryQuery,
} from "types/fivetran/google-play/statsStorePerformanceCountry";
import {
    StatsStorePerformanceTrafficSourceSchema,
    type StatsStorePerformanceTrafficSourceQuery,
} from "types/fivetran/google-play/statsStorePerformanceTrafficSource";
import { DataSourceSchema, type WidgetAPI } from "types/widget";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useFilterStore, { type FilterState } from "~/stores/filter";
import useUserStore from "~/stores/user";

const WIDGET_DATA_KEY = "widgetData";

export function useWidgetDataQuery(dashboardDef: DashboardAPI, widgetDef: WidgetAPI) {
    const user = useUserStore();
    const filters = useFilterStore();

    const params = getQueryDataParameters(dashboardDef, widgetDef, filters);

    return useQuery({
        queryKey: [WIDGET_DATA_KEY, widgetDef.dataSource, ...Object.values(params.searchParams)],
        queryFn: () =>
            doFetch({
                url: `${params.url}?${new URLSearchParams(params.searchParams as Record<string, string>).toString()}`,
                method: "GET",
                returnType: "json",
                schema: z.array(params.schema),
            }),
        enabled: user.isLoggedIn,
    });
}

type BaseQueryDataParameters<T = z.AnyZodObject> = {
    url: string;
    schema: T;
    searchParams: Record<string, unknown>;
};

function getQueryDataParameters(
    dashboardDef: DashboardAPI,
    widgetDef: WidgetAPI,
    filters: FilterState,
): BaseQueryDataParameters {
    switch (widgetDef.dataSource) {
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC:
            return {
                url: "/api/fivetran/google-play/stats-store-performance-traffic-source",
                schema: StatsStorePerformanceTrafficSourceSchema,
                searchParams: {
                    appId: dashboardDef.appId,
                    keywords: dashboardDef.keywords,
                    from: filters.from,
                    to: filters.to,
                } satisfies StatsStorePerformanceTrafficSourceQuery,
            };
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_COUNTRY:
            return {
                url: "/api/fivetran/google-play/stats-store-performance-country",
                schema: StatsStorePerformanceCountrySchema,
                searchParams: {
                    appId: dashboardDef.appId,
                    country: widgetDef.dataFilter,
                    from: filters.from,
                    to: filters.to,
                } satisfies StatsStorePerformanceCountryQuery,
            };
        default:
            widgetDef.dataSource satisfies never;
            throw new Error(`Unknown data type for widget data`);
    }
}

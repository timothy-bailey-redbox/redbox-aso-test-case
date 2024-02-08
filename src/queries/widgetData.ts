import { useQuery } from "react-query";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useFilterStore, { type FilterState } from "~/stores/filter";
import useUserStore from "~/stores/user";
import { type DashboardAPI } from "~/types/dashboard";
import {
    StatsStorePerformanceCountryDetails,
    StatsStorePerformanceCountrySchema,
    type StatsStorePerformanceCountryQuery,
} from "~/types/fivetran/google-play/statsStorePerformanceCountry";
import {
    StatsStorePerformanceTrafficSourceDetails,
    StatsStorePerformanceTrafficSourceSchema,
    type StatsStorePerformanceTrafficSourceQuery,
} from "~/types/fivetran/google-play/statsStorePerformanceTrafficSource";
import { DataSourceSchema, type WidgetAPI } from "~/types/widget";
import { type WidgetDataAxes } from "~/types/widgetData";

const WIDGET_DATA_KEY = "widgetData";

export function useWidgetDataQuery(dashboardDef: DashboardAPI, widgetDef: WidgetAPI) {
    const user = useUserStore();
    const filters = useFilterStore();

    const params = getQueryDataParameters(dashboardDef, widgetDef, filters);

    return useQuery({
        queryKey: [WIDGET_DATA_KEY, widgetDef.dataSource, ...Object.values(params.searchParams)],
        queryFn: async () => ({
            data: await doFetch({
                url: `${params.url}?${new URLSearchParams(params.searchParams as Record<string, string>).toString()}`,
                method: "GET",
                returnType: "json",
                schema: z.array(params.schema),
            }),
            details: params.details,
        }),
        enabled: user.isLoggedIn,
    });
}

type BaseQueryDataParameters<R extends z.ZodRawShape = z.ZodRawShape, T = z.ZodObject<R>> = {
    url: string;
    schema: T;
    searchParams: Record<string, unknown>;
    details: Record<keyof R, WidgetDataAxes>;
};

function getQueryDataParameters(
    dashboardDef: DashboardAPI,
    widgetDef: WidgetAPI,
    filters: FilterState,
): BaseQueryDataParameters {
    switch (widgetDef.dataSource) {
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC:
            return {
                url: "/api/fivetran/google/pref-traffic",
                schema: StatsStorePerformanceTrafficSourceSchema,
                searchParams: {
                    appId: dashboardDef.appId,
                    keywords: dashboardDef.keywords,
                    from: filters.from,
                    to: filters.to,
                } satisfies StatsStorePerformanceTrafficSourceQuery,
                details: StatsStorePerformanceTrafficSourceDetails,
            };
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_COUNTRY:
            return {
                url: "/api/fivetran/google/pref-country",
                schema: StatsStorePerformanceCountrySchema,
                searchParams: {
                    appId: dashboardDef.appId,
                    country: widgetDef.dataFilter,
                    from: filters.from,
                    to: filters.to,
                } satisfies StatsStorePerformanceCountryQuery,
                details: StatsStorePerformanceCountryDetails,
            };
        default:
            widgetDef.dataSource satisfies never;
            throw new Error(`Unknown data type for widget data`);
    }
}

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
import { DataSourceSchema, type DataSource, type WidgetAPI } from "types/widget";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useFilterStore, { type FilterState } from "~/stores/filter";
import useUserStore from "~/stores/user";

const WIDGET_DATA_KEY = "widgetData";

export function useWidgetDataQuery(dashboardDef: DashboardAPI, widgetDef: WidgetAPI) {
    const user = useUserStore();
    const filters = useFilterStore();

    const params = getQueryParams(dashboardDef, widgetDef, filters);

    return useQuery({
        queryKey: [WIDGET_DATA_KEY, widgetDef.dataSource, widgetDef.dataSource, ...Object.values(params)],
        queryFn: () =>
            doFetch({
                url: `${getAPIPath(widgetDef.dataSource)}?${new URLSearchParams(
                    params as Record<string, string>,
                ).toString()}`,
                method: "GET",
                returnType: "json",
                schema: z.array(getSchema(widgetDef.dataSource)),
            }),
        enabled: user.isLoggedIn,
    });
}

function getAPIPath(dataSource: DataSource): string {
    switch (dataSource) {
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC:
            return "/api/fivetran/google-play/stats-store-performance-traffic-source";
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_COUNTRY:
            return "/api/fivetran/google-play/stats-store-performance-country";
        default:
            dataSource satisfies never;
            throw new Error("Unknown data type for widget data");
    }
}

function getSchema(dataSource: DataSource): z.AnyZodObject {
    switch (dataSource) {
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC:
            return StatsStorePerformanceTrafficSourceSchema;
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_COUNTRY:
            return StatsStorePerformanceCountrySchema;
        default:
            dataSource satisfies never;
            throw new Error("Unknown data type for widget data");
    }
}

function getQueryParams(
    dashboardDef: DashboardAPI,
    widgetDef: WidgetAPI,
    filters: FilterState,
): Record<string, unknown> {
    switch (widgetDef.dataSource) {
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC:
            return {
                appId: dashboardDef.appId,
                keywords: dashboardDef.keywords,
                from: filters.from,
                to: filters.to,
            } satisfies StatsStorePerformanceTrafficSourceQuery;
        case DataSourceSchema.Values.GOOGLE_PERFORMANCE_COUNTRY:
            return {
                appId: dashboardDef.appId,
                country: widgetDef.dataFilter,
                from: filters.from,
                to: filters.to,
            } satisfies StatsStorePerformanceCountryQuery;
    }
    return {};
}

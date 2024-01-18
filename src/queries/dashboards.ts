import { useMutation, useQuery, useQueryClient } from "react-query";
import {
    DashboardAPISchema,
    type DashboardAPI,
    type DashboardAPICreation,
    type DashboardAPIUpdate,
} from "types/dashboard";
import { type Id } from "types/generic";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useUserStore from "~/stores/user";

const DASHBOARDS_KEY = "dashboards";
const DASHBOARD_KEY = "dashboard";

export function useDashboardsQuery() {
    const user = useUserStore();

    return useQuery({
        queryKey: DASHBOARDS_KEY,
        queryFn: async () => {
            const req = await doFetch({
                url: "/api/dashboards",
                method: "GET",
                returnType: "json",
                schema: z.object({
                    dashboards: z.array(DashboardAPISchema),
                }),
            });
            return req.dashboards;
        },
        enabled: user.isLoggedIn,
    });
}

export function useDashboardQuery(dashboardId: Id) {
    const user = useUserStore();

    return useQuery({
        queryKey: [DASHBOARD_KEY, dashboardId],
        queryFn: async () => {
            return await doFetch({
                url: `/api/dashboards/${dashboardId}`,
                method: "GET",
                returnType: "json",
                schema: DashboardAPISchema,
            });
        },
        enabled: user.isLoggedIn,
    });
}

export function useDashboardCreate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (payload: DashboardAPICreation) => {
            return await doFetch({
                url: "/api/dashboards",
                method: "POST",
                returnType: "json",
                schema: DashboardAPISchema,
                body: payload,
            });
        },
        onSuccess: (data) => {
            client.setQueryData<DashboardAPI[]>(DASHBOARDS_KEY, (dashboards) => {
                if (!dashboards) {
                    return [data];
                }
                return [...dashboards, data];
            });
            client.setQueryData([DASHBOARD_KEY, data.id], data);
        },
    });
}

export function useDashboardUpdate(dashboardId: Id) {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (payload: DashboardAPIUpdate) => {
            return await doFetch({
                url: `/api/dashboards/${dashboardId}`,
                method: "PATCH",
                returnType: "json",
                schema: DashboardAPISchema,
                body: payload,
            });
        },
        onSuccess: (data) => {
            client.setQueryData<DashboardAPI[]>(DASHBOARDS_KEY, (dashboards) => {
                if (!dashboards) {
                    return [data];
                }
                dashboards = dashboards.filter((d) => d.id !== dashboardId);
                return [...dashboards, data];
            });
            client.setQueryData([DASHBOARD_KEY, dashboardId], data);
        },
    });
}

export function useDashboardDelete(dashboardId: Id) {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            return await doFetch({
                url: `/api/dashboards/${dashboardId}`,
                method: "DELETE",
            });
        },
        onSuccess: () => {
            client.setQueryData<DashboardAPI[]>(DASHBOARDS_KEY, (dashboards) => {
                if (!dashboards) {
                    return [];
                }
                return dashboards.filter((d) => d.id !== dashboardId);
            });
            client.removeQueries([DASHBOARD_KEY, dashboardId]);
        },
    });
}

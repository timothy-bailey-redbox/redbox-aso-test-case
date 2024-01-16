import { useQuery } from "react-query";
import { DashboardAPISchema } from "types/dashboard";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useUserStore from "~/stores/user";

const DASHBOARD_KEY = "dashboards";

export default function useDashboardQuery() {
    const user = useUserStore();

    const query = useQuery({
        queryKey: DASHBOARD_KEY,
        queryFn: async () => {
            return await doFetch({
                url: "/api/dashboards",
                method: "GET",
                returnType: "json",
                schema: z.object({
                    dashboards: z.array(DashboardAPISchema),
                }),
            });
        },
        enabled: user.isLoggedIn,
    });

    return query;
}

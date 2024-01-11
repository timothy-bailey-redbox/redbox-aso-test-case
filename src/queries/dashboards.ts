import { useQuery } from "react-query";
import useUserStore from "~/stores/user";

const DASHBOARD_KEY = "dashboards";

export default function useDashboardQuery() {
    const user = useUserStore();

    const query = useQuery({
        queryKey: DASHBOARD_KEY,
        queryFn: async () => {
            const req = await fetch("/api/dashboard", {
                method: "GET",
                headers: {
                    Authorization: await user.getBearer(),
                },
            });
            return req.json();
        },
        enabled: user.isLoggedIn,
    });

    return query;
}

import { useRouter } from "next/router";

export default function useRouteDashboardId(): string | null {
    const { query } = useRouter();
    if (typeof query.dashboardId === "string") {
        return query.dashboardId;
    }
    return null;
}

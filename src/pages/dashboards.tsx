import Button from "~/components/Button";
import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import { useDashboardCreate, useDashboardDelete, useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";

export default function Dashboards() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();

    const dashboardCreate = useDashboardCreate();
    const dashboardDelete = useDashboardDelete();

    return (
        <SecurePage>
            <main
                style={{
                    display: "grid",
                    placeItems: "center",
                    minHeight: "100svh",
                }}
            >
                <div>
                    <h1>Dashboards</h1>
                    <LogoutButton />
                    <div>
                        <textarea cols={80} value={JSON.stringify(dashboards, null, 4)}></textarea>
                    </div>
                    <div>
                        <textarea cols={80} value={JSON.stringify(teams, null, 4)}></textarea>
                    </div>
                    <div>
                        <Button
                            onClick={() => {
                                void dashboardCreate.mutateAsync({
                                    appId: "1234",
                                    appType: "ANDROID",
                                    comparisonAppIds: [],
                                    keywords: ["test"],
                                    name: "Test Dashboard",
                                    teamId: teams.data?.[0]?.id ?? "",
                                    widgets: [],
                                });
                            }}
                        >
                            Create Dashboard
                        </Button>
                        <Button
                            onClick={() => {
                                void dashboardDelete.mutateAsync(
                                    dashboards.data?.[dashboards.data?.length - 1]?.id ?? "",
                                );
                            }}
                        >
                            Delete Dashboard
                        </Button>
                    </div>
                </div>
            </main>
        </SecurePage>
    );
}

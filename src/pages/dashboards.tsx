import { AppTypeSchema, StatusSchema } from "types/generic";
import { DataSourceSchema, WidgetTypeSchema } from "types/widget";
import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import Button from "~/components/basic/inputs/Button";
import { useDashboardCreate, useDashboardDelete, useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";
import { useWidgetDataQuery } from "~/queries/widgetData";

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
                    <TestWidget />
                </div>
            </main>
        </SecurePage>
    );
}

function TestWidget() {
    const data = useWidgetDataQuery(
        {
            appId: "com.livescore",
            appType: AppTypeSchema.Values.ANDROID,
            comparisonAppIds: [],
            id: "1",
            name: "test",
            keywords: ["football"],
            status: StatusSchema.Values.ACTIVE,
            teamId: "1",
            widgets: [],
            createdAt: 0,
            updatedAt: 0,
        },
        {
            id: "1",
            title: "test",
            dataSource: DataSourceSchema.Values.GOOGLE_PERFORMANCE_TRAFFIC,
            dataFilter: [],
            type: WidgetTypeSchema.Values.LINE_GRAPH,
            axis1: "store_listing_visitors",
            axis2: "date",
            height: 1,
            width: 1,
            x: 1,
            y: 1,
        },
    );

    return (
        <div>
            <textarea value={JSON.stringify(data, null, 4)}></textarea>
        </div>
    );
}

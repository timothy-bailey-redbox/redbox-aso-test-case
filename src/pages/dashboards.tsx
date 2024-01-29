import Link from "next/link";
import { dashboardSorter } from "~/components/assemblies/NavBar";
import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import Button from "~/components/basic/inputs/Button";
import PageWithNav from "~/components/wrappers/PageWithNav";
import { useDashboardCreate, useDashboardDelete, useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";

export default function Dashboards() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();

    const dashboardCreate = useDashboardCreate();
    const dashboardDelete = useDashboardDelete();

    return (
        <SecurePage>
            <PageWithNav>
                <main>
                    <div>
                        <h1>Dashboards</h1>
                        <LogoutButton />
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
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                                gap: 32,
                                padding: `32px 0`,
                            }}
                        >
                            <DataLoader query={dashboards}>
                                {dashboardSorter(dashboards.data).map((dash) => {
                                    return (
                                        <Link key={dash.id} href={`/dashboards/${dash.id}`}>
                                            <Card title={dash.name}>
                                                <div>{dash.description}</div>
                                            </Card>
                                        </Link>
                                    );
                                })}
                            </DataLoader>
                        </div>
                        <div>
                            <textarea cols={80} value={JSON.stringify(teams, null, 4)}></textarea>
                        </div>
                    </div>
                </main>
            </PageWithNav>
        </SecurePage>
    );
}

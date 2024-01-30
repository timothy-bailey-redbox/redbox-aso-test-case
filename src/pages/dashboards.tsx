import Link from "next/link";
import React from "react";
import { dashboardSorter } from "~/components/assemblies/NavBar";
import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import Grid, { GridItemProps } from "~/components/basic/Grid";
import Icons from "~/components/basic/Icons";
import Button from "~/components/basic/inputs/Button";
import PageWithNav from "~/components/wrappers/PageWithNav";
import { useDashboardCreate, useDashboardDelete, useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";
import useFilterStore from "~/stores/filter";
import useUserStore from "~/stores/user";

export default function Dashboards() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();
    const user = useUserStore();
    const { search } = useFilterStore();
    const dashboardCreate = useDashboardCreate();
    const dashboardDelete = useDashboardDelete();

    const sortedDashboards = dashboardSorter(dashboards.data, search);

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
                        </div>
                        <DataLoader query={dashboards}>
                            {teams.data
                                ?.toSorted((a, b) => a.createdAt - b.createdAt)
                                ?.map((team) => {
                                    return (
                                        <React.Fragment key={team.id}>
                                            <h2>{team.name}</h2>
                                            <Grid>
                                                {sortedDashboards.get(team.id)?.map((dash): GridItemProps => {
                                                    const href = `/dashboards/${dash.id}`;
                                                    return {
                                                        width: 4,
                                                        height: 1,
                                                        element: (
                                                            <Card
                                                                key={dash.id}
                                                                title={<Link href={href}>{dash.name}</Link>}
                                                                actionButton={
                                                                    user.isAdmin && (
                                                                        <Button
                                                                            onClick={() => {
                                                                                void dashboardDelete.mutateAsync(
                                                                                    dash.id,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <Icons.Delete width={18} height={18} />
                                                                        </Button>
                                                                    )
                                                                }
                                                            >
                                                                <Link href={href}>{dash.description}</Link>
                                                            </Card>
                                                        ),
                                                    };
                                                }) ?? []}
                                            </Grid>
                                        </React.Fragment>
                                    );
                                })}
                        </DataLoader>
                        <div>
                            <textarea cols={80} value={JSON.stringify(teams, null, 4)}></textarea>
                        </div>
                    </div>
                </main>
            </PageWithNav>
        </SecurePage>
    );
}

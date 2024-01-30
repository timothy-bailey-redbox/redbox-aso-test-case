import Widget from "~/components/assemblies/Widgets";
import SecurePage from "~/components/auth/SecurePage";
import DataLoader from "~/components/basic/DataLoader";
import Grid, { type GridItemProps } from "~/components/basic/Grid";
import PageWithNav from "~/components/wrappers/PageWithNav";
import useRouteDashboardId from "~/lib/useRouteDashboardId";
import { useDashboardQuery } from "~/queries/dashboards";

export default function EnsureDashboardId() {
    const dashboardId = useRouteDashboardId();
    if (!dashboardId) {
        return null; // TODO 404
    }

    return <DashboardPage dashboardId={dashboardId} />;
}

function DashboardPage({ dashboardId }: { dashboardId: string }) {
    const dashboard = useDashboardQuery(dashboardId);

    return (
        <SecurePage>
            <PageWithNav>
                <DataLoader query={dashboard}>
                    <header style={{ marginBottom: 32 }}>
                        <h1>{dashboard.data?.name}</h1>
                        <small>{dashboard.data?.description}</small>
                    </header>
                    <Grid>
                        {
                            (dashboard.data?.widgets?.map((widget) => {
                                return {
                                    element: <Widget widget={widget} dashboard={dashboard.data} />,
                                    width: widget.width,
                                    height: widget.height,
                                    x: widget.x,
                                    y: widget.y,
                                };
                            }) ?? []) satisfies GridItemProps[]
                        }
                    </Grid>
                </DataLoader>
            </PageWithNav>
        </SecurePage>
    );
}

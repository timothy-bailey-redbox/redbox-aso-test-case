import Link from "next/link";
import React from "react";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import Grid, { type GridItemProps } from "~/components/basic/Grid";
import Icons from "~/components/basic/Icons";
import ButtonLink from "~/components/basic/inputs/Button/ButtonLink";
import { useDashboardDelete, useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";
import useFilterStore from "~/stores/filter";
import useUserStore from "~/stores/user";
import ConfirmButton from "../ConfirmButton";
import { dashboardSorter } from "../NavBar";
import styles from "./dashboardList.module.css";

export default function DashboardList() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();
    const user = useUserStore();
    const { search } = useFilterStore();
    const dashboardDelete = useDashboardDelete();

    const sortedDashboards = dashboardSorter(dashboards.data, search);

    return (
        <div>
            <DataLoader query={dashboards}>
                {teams.data
                    ?.toSorted((a, b) => a.createdAt - b.createdAt)
                    ?.map((team) => {
                        return (
                            <React.Fragment key={team.id}>
                                <h2 className={styles.title}>{team.name}</h2>
                                <Grid>
                                    {[
                                        ...(sortedDashboards.get(team.id)?.map((dash): GridItemProps => {
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
                                                                <ConfirmButton
                                                                    label={<Icons.Delete width={18} height={18} />}
                                                                    confirmLabel="Delete"
                                                                    onClick={() => dashboardDelete.mutateAsync(dash.id)}
                                                                    query={dashboardDelete}
                                                                >
                                                                    Are you sure you want to delete this dashboard?
                                                                </ConfirmButton>
                                                            )
                                                        }
                                                    >
                                                        {dash.description && (
                                                            <Link href={href}>{dash.description}</Link>
                                                        )}
                                                    </Card>
                                                ),
                                            };
                                        }) ?? []),
                                        {
                                            width: 4,
                                            height: 1,
                                            element: (
                                                <Card>
                                                    <ButtonLink href="/dashboards/create" className={styles.addBtn}>
                                                        <Icons.Add width={20} height={20} />
                                                    </ButtonLink>
                                                </Card>
                                            ),
                                        },
                                    ]}
                                </Grid>
                            </React.Fragment>
                        );
                    })}
            </DataLoader>
        </div>
    );
}

import clsx from "clsx";
import { group } from "d3";
import Link from "next/link";
import React from "react";
import DataLoader from "~/components/basic/DataLoader";
import Icons from "~/components/basic/Icons";
import useRouteDashboardId from "~/lib/useRouteDashboardId";
import { useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";
import useFilterStore from "~/stores/filter";
import { type DashboardAPI } from "~/types/dashboard";
import Input from "../../basic/inputs/Input";
import styles from "./navbar.module.css";

export function dashboardSorter(list: DashboardAPI[] = [], searchString = "") {
    const boards = list
        .filter(
            (board) =>
                board.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()) ||
                board.description?.toLocaleLowerCase()?.includes(searchString.toLocaleLowerCase()),
        )
        .sort((dashA, dashB) => {
            return dashA.name.localeCompare(dashB.name);
        });
    return group(boards, (b) => b.teamId);
}

export default function NavBar() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();
    const activeId = useRouteDashboardId();
    const { search, setSearch } = useFilterStore();

    const sortedDashboards = dashboardSorter(dashboards?.data, search);

    return (
        <div className={styles.navbar}>
            <div className={styles.wrapper}>
                <Link href="/dashboards">
                    <Icons.Redbox height={100} width={132} />
                </Link>
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <DataLoader query={teams}>
                    <DataLoader query={dashboards}>
                        <ul className={styles.list}>
                            {teams.data
                                ?.toSorted((a, b) => a.createdAt - b.createdAt)
                                ?.map((team) => {
                                    return (
                                        <React.Fragment key={team.id}>
                                            <li className={styles.team}>{team.name}</li>
                                            {sortedDashboards.get(team.id)?.map((dash) => (
                                                <li
                                                    key={dash.id}
                                                    className={clsx({ [styles.isActive!]: activeId === dash.id })}
                                                >
                                                    <Link href={`/dashboards/${dash.id}`}>{dash.name}</Link>
                                                </li>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                        </ul>
                    </DataLoader>
                </DataLoader>
            </div>
        </div>
    );
}

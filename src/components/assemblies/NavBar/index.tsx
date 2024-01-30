import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { type DashboardAPI } from "types/dashboard";
import DataLoader from "~/components/basic/DataLoader";
import Icons from "~/components/basic/Icons";
import useRouteDashboardId from "~/lib/useRouteDashboardId";
import { useDashboardsQuery } from "~/queries/dashboards";
import Input from "../../basic/inputs/Input";
import styles from "./navbar.module.css";

export function dashboardSorter(list: DashboardAPI[] = [], searchString = "") {
    return list
        .filter(
            (board) =>
                board.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()) ||
                board.description?.toLocaleLowerCase()?.includes(searchString.toLocaleLowerCase()),
        )
        .sort((dashA, dashB) => {
            return dashA.name.localeCompare(dashB.name);
        });
}

export default function NavBar() {
    const dashboards = useDashboardsQuery();
    const activeId = useRouteDashboardId();

    const [searchString, setSearchString] = useState("");

    const filteredDashboards = dashboardSorter(dashboards?.data, searchString);

    return (
        <div className={styles.navbar}>
            <div className={styles.wrapper}>
                <Link href="/dashboards">
                    <Icons.Redbox height={100} width={132} />
                </Link>
                <Input placeholder="Search..." value={searchString} onChange={(e) => setSearchString(e.target.value)} />
                <DataLoader query={dashboards}>
                    <ul className={styles.list}>
                        {filteredDashboards?.map((dash) => (
                            <li key={dash.id} className={clsx({ [styles.isActive!]: activeId === dash.id })}>
                                <Link href={`/dashboards/${dash.id}`}>{dash.name}</Link>
                            </li>
                        ))}
                    </ul>
                </DataLoader>
            </div>
        </div>
    );
}

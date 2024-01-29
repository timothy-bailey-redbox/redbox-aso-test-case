import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import DataLoader from "~/components/basic/DataLoader";
import Icons from "~/components/basic/Icons";
import useRouteDashboardId from "~/lib/useRouteDashboardId";
import { useDashboardsQuery } from "~/queries/dashboards";
import TextInput from "../../basic/inputs/TextInput";
import styles from "./navbar.module.css";

export default function NavBar() {
    const dashboards = useDashboardsQuery();
    const activeId = useRouteDashboardId();

    const [searchString, setSearchString] = useState("");

    const filteredDashboards = dashboards?.data
        ?.filter(
            (board) =>
                board.name.toLocaleLowerCase().includes(searchString.toLocaleLowerCase()) ||
                board.description?.toLocaleLowerCase()?.includes(searchString.toLocaleLowerCase()),
        )
        ?.sort((dashA, dashB) => {
            return dashA.name.localeCompare(dashB.name);
        });

    return (
        <div className={styles.navbar}>
            <div className={styles.wrapper}>
                <Link href="/dashboards">
                    <Icons.Redbox height={100} width={132} />
                </Link>
                <TextInput
                    placeholder="Search..."
                    value={searchString}
                    onChange={(e) => setSearchString(e.target.value)}
                />
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

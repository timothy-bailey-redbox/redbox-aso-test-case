import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import { useDashboardsQuery } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";

export default function Dashboards() {
    const teams = useTeamsQuery();
    const dashboards = useDashboardsQuery();

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
                    <br />
                    <div>
                        <textarea cols={80} value={JSON.stringify(dashboards, null, 4)}></textarea>
                    </div>
                    <div>
                        <textarea cols={80} value={JSON.stringify(teams, null, 4)}></textarea>
                    </div>
                </div>
            </main>
        </SecurePage>
    );
}

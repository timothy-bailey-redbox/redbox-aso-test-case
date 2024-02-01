import DashboardList from "~/components/assemblies/DashboardList";
import LogoutButton from "~/components/auth/LogoutButton";
import SecurePage from "~/components/auth/SecurePage";
import PageWithNav from "~/components/wrappers/PageWithNav";

export default function Dashboards() {
    return (
        <SecurePage>
            <PageWithNav>
                <main>
                    <div>
                        {/* TODO - Use Alex's header */}
                        <h1>Dashboards</h1>
                        <div>
                            <LogoutButton />
                        </div>
                        <DashboardList />
                    </div>
                </main>
            </PageWithNav>
        </SecurePage>
    );
}

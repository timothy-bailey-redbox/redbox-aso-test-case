import SecurePage from "~/components/auth/SecurePage";
import DataLoader from "~/components/basic/DataLoader";
import Button from "~/components/basic/inputs/Button";
import PageWithNav from "~/components/wrappers/PageWithNav";
import { useDashboardCreate } from "~/queries/dashboards";
import { useTeamsQuery } from "~/queries/teams";

export default function Create() {
    const dashboardCreate = useDashboardCreate();
    const teams = useTeamsQuery();

    return (
        <SecurePage>
            <PageWithNav>
                <h1>Create Dashboard</h1>
                <DataLoader query={teams}>
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
                </DataLoader>
            </PageWithNav>
        </SecurePage>
    );
}

import EditTeam from "~/components/assemblies/EditTeam";
import SecurePage from "~/components/auth/SecurePage";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import PageWithNav from "~/components/wrappers/PageWithNav";
import useRouteTeamId from "~/lib/useRouteTeamId";
import { useTeamQuery } from "~/queries/teams";

export default function EnsureTeamId() {
    const teamId = useRouteTeamId();
    if (!teamId) {
        return (
            <SecurePage>
                <PageWithNav>404</PageWithNav>
            </SecurePage>
        );
    }
    return <TeamPage teamId={teamId} />;
}

function TeamPage({ teamId }: { teamId: string }) {
    const team = useTeamQuery(teamId);
    return (
        <SecurePage>
            <PageWithNav>
                <DataLoader query={team}>
                    <header style={{ paddingBlockEnd: 32 }}>
                        <h1>{team.data?.name}</h1>
                    </header>
                    <Card>{team.data && <EditTeam team={team.data} />}</Card>
                </DataLoader>
            </PageWithNav>
        </SecurePage>
    );
}

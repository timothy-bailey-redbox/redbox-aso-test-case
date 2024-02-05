import { useRouter } from "next/router";
import ConfirmButton from "~/components/assemblies/ConfirmButton";
import EditTeam from "~/components/assemblies/EditTeam";
import SecurePage from "~/components/auth/SecurePage";
import Card from "~/components/basic/Card";
import DataLoader from "~/components/basic/DataLoader";
import PageWithNav from "~/components/wrappers/PageWithNav";
import useRouteTeamId from "~/lib/useRouteTeamId";
import { useTeamDelete, useTeamQuery, useTeamUpdate } from "~/queries/teams";
import useUserStore from "~/stores/user";

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
    const updateTeam = useTeamUpdate();
    const user = useUserStore();
    const deleteTeam = useTeamDelete();
    const router = useRouter();

    if (!user.isAdmin) {
        return (
            <SecurePage>
                <PageWithNav>Access denied</PageWithNav>
            </SecurePage>
        );
    }

    return (
        <SecurePage>
            <PageWithNav>
                <DataLoader query={team}>
                    {team.data && (
                        <>
                            <header style={{ paddingBlockEnd: 32 }}>
                                <h1>{team.data.name}</h1>
                            </header>
                            <div style={{ display: "grid", gap: 24 }}>
                                <Card>
                                    <EditTeam
                                        team={team.data}
                                        query={updateTeam}
                                        onSubmit={async (data) => {
                                            await updateTeam.mutateAsync({
                                                id: team.data.id,
                                                update: {
                                                    name: data.name,
                                                    users: data.users,
                                                },
                                            });
                                        }}
                                    />
                                </Card>
                                <Card>
                                    <div>
                                        <ConfirmButton
                                            label="Delete Team"
                                            onClick={async () => {
                                                await deleteTeam.mutateAsync(team.data.id);
                                                await router.push("/dashboards");
                                            }}
                                            query={deleteTeam}
                                            danger
                                        >
                                            Are you sure you want to delete this team?
                                        </ConfirmButton>
                                    </div>
                                </Card>
                            </div>
                        </>
                    )}
                </DataLoader>
            </PageWithNav>
        </SecurePage>
    );
}

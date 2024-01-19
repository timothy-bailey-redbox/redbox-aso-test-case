import { useMutation, useQuery, useQueryClient } from "react-query";
import { type Id } from "types/generic";
import { TeamSchema, type Team, type TeamCreation, type TeamUpdate } from "types/team";
import { z } from "zod";
import { doFetch } from "~/lib/doFetch";
import useUserStore from "~/stores/user";

const TEAM_KEY = "team";
const TEAMS_KEY = "teams";

export function useTeamsQuery() {
    const user = useUserStore();

    return useQuery({
        queryKey: TEAMS_KEY,
        queryFn: async () => {
            const req = await doFetch({
                url: "/api/teams",
                method: "GET",
                returnType: "json",
                schema: z.object({
                    teams: z.array(TeamSchema),
                }),
            });
            return req.teams;
        },
        enabled: user.isLoggedIn,
    });
}

export function useTeamQuery(teamId: Id) {
    const user = useUserStore();

    return useQuery({
        queryKey: [TEAM_KEY, teamId],
        queryFn: async () => {
            return await doFetch({
                url: `/api/teams/${teamId}`,
                method: "GET",
                returnType: "json",
                schema: TeamSchema,
            });
        },
        enabled: user.isLoggedIn,
    });
}

export function useTeamCreate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (payload: TeamCreation) => {
            return await doFetch({
                url: "/api/teams",
                method: "POST",
                returnType: "json",
                schema: TeamSchema,
                body: payload,
            });
        },
        onSuccess: (data) => {
            client.setQueryData<Team[]>(TEAMS_KEY, (teams) => {
                if (!teams) {
                    return [data];
                }
                return [...teams, data];
            });
            client.setQueryData([TEAM_KEY, data.id], data);
        },
    });
}

export function useTeamUpdate() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (payload: { id: Id; update: TeamUpdate }) => {
            return await doFetch({
                url: `/api/teams/${payload.id}`,
                method: "PATCH",
                returnType: "json",
                schema: TeamSchema,
                body: payload.update,
            });
        },
        onSuccess: (data) => {
            client.setQueryData<Team[]>(TEAMS_KEY, (teams) => {
                if (!teams) {
                    return [data];
                }
                teams = teams.filter((d) => d.id !== data.id);
                return [...teams, data];
            });
            client.setQueryData([TEAM_KEY, data.id], data);
        },
    });
}

export function useTeamDelete() {
    const client = useQueryClient();

    return useMutation({
        mutationFn: async (teamId: Id) => {
            return await doFetch({
                url: `/api/teams/${teamId}`,
                method: "DELETE",
            });
        },
        onSuccess: (data, teamId) => {
            client.setQueryData<Team[]>(TEAMS_KEY, (teams) => {
                if (!teams) {
                    return [];
                }
                return teams.filter((d) => d.id !== teamId);
            });
            client.removeQueries([TEAM_KEY, teamId]);
        },
    });
}

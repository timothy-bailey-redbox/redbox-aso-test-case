import { type Config } from "@netlify/functions";
import { assertIsAdmin } from "netlify/lib/auth";
import uiDb, { getTeam } from "netlify/lib/db/uiDb";
import functionHandler from "netlify/lib/handler";
import { parseWithSchema } from "netlify/lib/parser";
import { StatusSchema } from "types/generic";
import { TeamUpdateSchema, type Team } from "types/team";
import { z } from "zod";

export const config: Config = {
    path: "/api/teams/:teamId",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const teamId = parseWithSchema(context.params.teamId, z.string().uuid());

            return {
                body: await getTeam(teamId, user),
            };
        },

        patch: async (req, context, user) => {
            assertIsAdmin(user);
            const teamId = parseWithSchema(context.params.teamId, z.string().uuid());

            const props = parseWithSchema(await req.json(), TeamUpdateSchema);

            const team = await getTeam(teamId, user);

            const [updatedTeam] = await uiDb.mutate<Team>(
                `UPDATE "teams"
                SET
                    "name" = :name,
                    "users" = :users,
                    "status" = :status,
                    "updatedAt" = CURRENT_TIMESTAMP
                WHERE "id" = :teamId
                RETURNING *`,
                {
                    teamId,
                    name: props.name ?? team.name,
                    users: props.users ?? team.users,
                    status: props.status ?? team.status,
                },
            );

            return {
                statusCode: 200,
                body: updatedTeam,
            };
        },

        delete: async (req, context, user) => {
            assertIsAdmin(user);
            const teamId = parseWithSchema(context.params.teamId, z.string().uuid());

            await uiDb.mutate(
                `UPDATE "teams"
                SET
                    "status" = :status,
                    "updatedAt" = CURRENT_TIMESTAMP
                WHERE "id" = :teamId`,
                {
                    teamId,
                    status: StatusSchema.Values.DELETED,
                },
            );

            return {};
        },
    },
});
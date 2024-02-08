import { z } from "zod";
import { assertIsAdmin } from "~/lib/api/auth";
import uiDb, { getTeam } from "~/lib/api/db/uiDb";
import functionHandler from "~/lib/api/handler";
import { parseWithSchema } from "~/lib/api/parser";
import { StatusSchema } from "~/types/generic";
import { TeamUpdateSchema, type Team } from "~/types/team";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, user) => {
            const teamId = parseWithSchema(req.query.teamId, z.string().uuid());

            return {
                body: await getTeam(teamId, user),
            };
        },

        patch: async (req, user) => {
            assertIsAdmin(user);
            const teamId = parseWithSchema(req.query.teamId, z.string().uuid());

            const props = parseWithSchema(req.body, TeamUpdateSchema);

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

        delete: async (req, user) => {
            assertIsAdmin(user);
            const teamId = parseWithSchema(req.query.teamId, z.string().uuid());

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

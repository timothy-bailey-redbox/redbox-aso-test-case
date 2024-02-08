import { assertIsAdmin } from "~/lib/api/auth";
import { writeInsertQuery } from "~/lib/api/db";
import uiDb, { getTeams } from "~/lib/api/db/uiDb";
import functionHandler from "~/lib/api/handler";
import { parseWithSchema } from "~/lib/api/parser";
import { StatusSchema } from "~/types/generic";
import { TeamCreationSchema, TeamSchema, type Team } from "~/types/team";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, user) => {
            const teams = await getTeams(user);

            return {
                body: {
                    teams,
                },
            };
        },

        post: async (req, user) => {
            assertIsAdmin(user);

            const props = parseWithSchema(req.body, TeamCreationSchema);

            const [team] = await uiDb.mutate<Team>(
                writeInsertQuery(TeamSchema, "teams", ["id", "createdAt", "updatedAt"]),
                {
                    name: props.name,
                    users: props.users,
                    status: StatusSchema.Values.ACTIVE,
                    updatedAt: Date.now(),
                },
            );

            return {
                statusCode: 201,
                body: team,
            };
        },
    },
});

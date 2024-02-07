import { StatusSchema } from "types/generic";
import { TeamCreationSchema, TeamSchema, type Team } from "types/team";
import { assertIsAdmin } from "~/api/auth";
import { writeInsertQuery } from "~/api/db";
import uiDb, { getTeams } from "~/api/db/uiDb";
import functionHandler from "~/api/handler";
import { parseWithSchema } from "~/api/parser";

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

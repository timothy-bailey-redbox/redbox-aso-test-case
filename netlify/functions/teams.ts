import { type Config } from "@netlify/functions";
import { assertIsAdmin } from "netlify/lib/auth";
import { writeInsertQuery } from "netlify/lib/db";
import uiDb, { getTeams } from "netlify/lib/db/uiDb";
import functionHandler from "netlify/lib/handler";
import { parseWithSchema } from "netlify/lib/parser";
import { StatusSchema } from "types/generic";
import { TeamCreationSchema, TeamSchema, type Team } from "types/team";

export const config: Config = {
    //path: "/.netlify/functions/teams",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const teams = await getTeams(user);

            return {
                body: {
                    teams,
                },
            };
        },

        post: async (req, context, user) => {
            assertIsAdmin(user);

            const props = parseWithSchema(await req.json(), TeamCreationSchema);

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

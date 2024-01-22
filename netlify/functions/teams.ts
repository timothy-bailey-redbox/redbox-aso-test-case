import { type Config } from "@netlify/functions";
import { isAdmin } from "netlify/lib/auth";
import { writeInsertQuery } from "netlify/lib/db";
import uiDb, { getTeams } from "netlify/lib/db/uiDb";
import functionHandler, { HTTPResponseError } from "netlify/lib/handler";
import { parseWithSchema } from "netlify/lib/parser";
import { StatusSchema } from "types/generic";
import { TeamSchema, type Team } from "types/team";

export const config: Config = {
    path: "/api/teams",
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
            if (!isAdmin(user)) {
                throw new HTTPResponseError(403, "");
            }

            const schema = TeamSchema.omit({
                id: true,
                updatedAt: true,
                createdAt: true,
                status: true,
            });
            const props = parseWithSchema(await req.json(), schema);

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

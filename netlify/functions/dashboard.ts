import { uiDb } from "netlify/lib/db";
import functionHandler from "../lib/handler";

const handler = functionHandler({
    secure: true,
    handlers: {
        get: async (event, user) => {
            // const dashboards = await uiDb.select(
            //     `SELECT d.*
            //     FROM dashboards d
            //     INNER JOIN teams t ON t.id = d.teamId
            //     WHERE ANY(t.users) = $1`,
            //     [user.email],
            // );
            const dashboards = await uiDb.select(`SELECT Now() as now`, []);

            return {
                body: JSON.stringify({
                    dashboards,
                }),
            };
        },
    },
});

export { handler };

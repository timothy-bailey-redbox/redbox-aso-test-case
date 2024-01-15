import { uiDb } from "netlify/lib/db";
import { StatusSchema } from "types/generic";
import functionHandler from "../lib/handler";

const handler = functionHandler({
    secure: true,
    handlers: {
        get: async (event, user) => {
            const dashboards = await uiDb.select(
                `SELECT d.*
                FROM dashboards d
                INNER JOIN teams t ON t.id = d."teamId"
                WHERE $1::text = ANY(t.users)
                AND d."status" = $2
                AND t."status" = $2`,
                [user.email, StatusSchema.Values.ACTIVE],
            );

            for (const dashboard of dashboards) {
                dashboard.widgets = await uiDb.select(
                    `SELECT *
                    FROM widgets
                    WHERE "dashboardId" = $1`,
                    [dashboard.id],
                );
            }

            return {
                body: JSON.stringify({
                    dashboards,
                }),
            };
        },
    },
});

export { handler };

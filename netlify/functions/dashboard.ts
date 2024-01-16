import { type Config } from "@netlify/functions";
import { uiDb } from "netlify/lib/db";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import functionHandler from "netlify/lib/handler";
import { type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { type WidgetDB } from "types/widget";

export const config: Config = {
    path: "/api/dashboards/:dashboardId",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const { dashboardId } = context.params;

            const [dashboard] = await uiDb.select<DashboardDB>(
                `SELECT d.*
                FROM dashboards d
                INNER JOIN teams t ON t.id = d."teamId"
                WHERE d."id" = $1
                AND $2::text = ANY(t.users)
                AND d."status" = $3
                AND t."status" = $3`,
                [dashboardId, user.email, StatusSchema.Values.ACTIVE],
            );

            const widgets = await uiDb.select<WidgetDB>(
                `SELECT *
                FROM widgets
                WHERE "dashboardId" = $1`,
                [dashboardId],
            );

            return {
                body: JSON.stringify(dashboardDBToAPI(dashboard, widgets)),
            };
        },
    },
});

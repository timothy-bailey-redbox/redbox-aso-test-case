import { type Config } from "@netlify/functions";
import { uiDb } from "netlify/lib/db";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import functionHandler from "netlify/lib/handler";
import { type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { type WidgetDB } from "types/widget";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            console.log({
                req,
                context,
                user,
            });

            const { dashboardId } = context.params;

            const dashboard = await uiDb.transaction(async (queryFn) => {
                const [dashboard] = await queryFn<DashboardDB>(
                    `SELECT d.*
                    FROM dashboards d
                    INNER JOIN teams t ON t.id = d."teamId"
                    WHERE "id" = $1
                    AND $2::text = ANY(t.users)
                    AND d."status" = $3
                    AND t."status" = $3`,
                    [dashboardId, user.email, StatusSchema.Values.ACTIVE],
                );
                const widgets = await queryFn<WidgetDB>(
                    `SELECT *
                    FROM widgets
                    WHERE "dashboardId" = $1`,
                    [dashboardId],
                );

                return dashboardDBToAPI(dashboard, widgets);
            });

            return {
                body: JSON.stringify(dashboard),
            };
        },
    },
});

export const config: Config = {
    path: "/api/get-dashboard/:dashboardId",
};

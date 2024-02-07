import { type Config } from "@netlify/functions";
import { assertIsAdmin } from "netlify/lib/auth";
import { writeInsertQuery } from "netlify/lib/db";
import uiDb, { getDashboards } from "netlify/lib/db/uiDb";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import { parseWithSchema } from "netlify/lib/parser";
import { DashboardAPICreationSchema, DashboardDBSchema, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetDBSchema, type WidgetDB } from "types/widget";
import functionHandler from "../lib/handler";

export const config: Config = {
    path: "/.netlify/functions/dashboards",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const dashboards = await getDashboards(user);

            return {
                body: { dashboards: dashboards.map(([dashboard, widgets]) => dashboardDBToAPI(dashboard, widgets)) },
            };
        },

        post: async (req, context, user) => {
            assertIsAdmin(user);

            const props = parseWithSchema(await req.json(), DashboardAPICreationSchema);

            const dashboard = await uiDb.transaction(async (query) => {
                const [dash] = await query<DashboardDB>(
                    writeInsertQuery(DashboardDBSchema, "dashboards", ["id", "createdAt", "updatedAt"]),
                    {
                        description: null,
                        ...props,
                        status: StatusSchema.Values.ACTIVE,
                    },
                );

                const widgets: WidgetDB[] = [];
                for (const widgetProps of props.widgets) {
                    widgets.push(
                        ...(await query<WidgetDB>(writeInsertQuery(WidgetDBSchema, "widgets", ["id"]), {
                            axis2: null,
                            axis3: null,
                            description: null,
                            dashboardId: dash?.id,
                            ...widgetProps,
                        })),
                    );
                }

                return dashboardDBToAPI(dash, widgets);
            });

            return {
                statusCode: 201,
                body: dashboard,
            };
        },
    },
});

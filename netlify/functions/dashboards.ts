import { type Config } from "@netlify/functions";
import { assertIsAdmin } from "netlify/lib/auth";
import { writeInsertQuery } from "netlify/lib/db";
import uiDb, { getDashboards } from "netlify/lib/db/uiDb";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import { parseWithSchema } from "netlify/lib/parser";
import { DashboardAPISchema, DashboardDBSchema, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetAPISchema, WidgetDBSchema, type WidgetDB } from "types/widget";
import { z } from "zod";
import functionHandler from "../lib/handler";

export const config: Config = {
    path: "/api/dashboards",
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

            const schema = DashboardAPISchema.omit({
                id: true,
                updatedAt: true,
                createdAt: true,
                status: true,
                widgets: true,
            }).extend({
                widgets: z.array(
                    WidgetAPISchema.omit({
                        id: true,
                    }),
                ),
            });

            const props = parseWithSchema(await req.json(), schema);

            const dashboard = await uiDb.transaction(async (query) => {
                const [dash] = await query<DashboardDB>(
                    writeInsertQuery(DashboardDBSchema, "dashboards", ["id", "createdAt", "updatedAt"]),
                    {
                        ...props,
                        status: StatusSchema.Values.ACTIVE,
                    },
                );

                const widgets: WidgetDB[] = [];
                for (const widgetProps of props.widgets) {
                    widgets.push(
                        ...(await query<WidgetDB>(writeInsertQuery(WidgetDBSchema, "widgets", ["id"]), {
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

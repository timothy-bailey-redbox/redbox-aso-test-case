import { DashboardAPICreationSchema, DashboardDBSchema, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetDBSchema, type WidgetDB } from "types/widget";
import { assertIsAdmin } from "~/api/auth";
import { writeInsertQuery } from "~/api/db";
import uiDb, { getDashboards } from "~/api/db/uiDb";
import { dashboardDBToAPI } from "~/api/dto/dashboard";
import functionHandler from "~/api/handler";
import { parseWithSchema } from "~/api/parser";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, user) => {
            const dashboards = await getDashboards(user);

            return {
                body: { dashboards: dashboards.map(([dashboard, widgets]) => dashboardDBToAPI(dashboard, widgets)) },
            };
        },

        post: async (req, user) => {
            assertIsAdmin(user);

            const props = parseWithSchema(req.body, DashboardAPICreationSchema);

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
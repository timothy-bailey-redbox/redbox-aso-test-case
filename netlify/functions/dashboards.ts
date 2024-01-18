import { type Config } from "@netlify/functions";
import { uiDb } from "netlify/lib/db";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import { parseWithSchema } from "netlify/lib/parser";
import { DashboardAPISchema, type DashboardAPI, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetAPISchema, type WidgetDB } from "types/widget";
import { z } from "zod";
import functionHandler from "../lib/handler";

export const config: Config = {
    path: "/api/dashboards",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const dashboards: DashboardAPI[] = [];

            const dashboardsData = await uiDb.select<DashboardDB>(
                `SELECT d.*
                FROM dashboards d
                INNER JOIN teams t ON t.id = d."teamId"
                WHERE $1::text = ANY(t.users)
                AND d."status" = $2
                AND t."status" = $2`,
                [user.email, StatusSchema.Values.ACTIVE],
            );

            for (const dashboard of dashboardsData) {
                const widgets = await uiDb.select<WidgetDB>(
                    `SELECT *
                    FROM widgets
                    WHERE "dashboardId" = $1`,
                    [dashboard.id],
                );

                dashboards.push(dashboardDBToAPI(dashboard, widgets));
            }

            return {
                body: { dashboards },
            };
        },

        post: async (req) => {
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
                    `INSERT INTO "dashboards"(
                        "name",
                        "description",
                        "teamId",
                        "appId",
                        "appType",
                        "comparisonAppIds",
                        "keywords"
                        "status"
                    )
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8)`,
                    [
                        props.name,
                        props.description,
                        props.teamId,
                        props.appId,
                        props.appType,
                        props.comparisonAppIds,
                        props.keywords,
                        StatusSchema.Values.ACTIVE,
                    ],
                );

                const widgets: WidgetDB[] = [];
                for (const widgetProps of props.widgets) {
                    widgets.push(
                        ...(await query<WidgetDB>(
                            `INSERT INTO "widgets"(
                                "dashboardId"
                                "type"
                                "dataSource"
                                "dataType"
                                "title"
                                "description"
                                "axis1"
                                "axis2"
                                "axis3"
                                "height"
                                "width"
                                "x"
                                "y"
                            )
                            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                            [
                                dash?.id,
                                widgetProps.type,
                                widgetProps.dataSource,
                                widgetProps.dataType,
                                widgetProps.title,
                                widgetProps.description,
                                widgetProps.axis1,
                                widgetProps.axis2,
                                widgetProps.axis3,
                                widgetProps.height,
                                widgetProps.width,
                                widgetProps.x,
                                widgetProps.y,
                            ],
                        )),
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

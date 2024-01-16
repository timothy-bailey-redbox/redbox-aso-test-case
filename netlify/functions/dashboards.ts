import { uiDb } from "netlify/lib/db";
import { parseJSONWithSchema } from "netlify/lib/parser";
import { DashboardAPISchema, type DashboardAPI, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetAPISchema, type WidgetAPI, type WidgetDB } from "types/widget";
import { z } from "zod";
import functionHandler, { HTTPResponseError } from "../lib/handler";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
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

            const props = parseJSONWithSchema(await req.text(), schema);

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
                body: JSON.stringify(dashboard),
            };
        },
    },
});

export function dashboardDBToAPI(dashboard?: DashboardDB, widgets: WidgetDB[] = []): DashboardAPI {
    if (!dashboard) {
        throw new HTTPResponseError(500, "Missing dashboard data to convert to response");
    }
    return {
        id: dashboard.id,

        name: dashboard.name,
        description: dashboard.description,
        status: dashboard.status,
        teamId: dashboard.teamId,

        appId: dashboard.appId,
        appType: dashboard.appType,
        comparisonAppIds: dashboard.comparisonAppIds,

        keywords: dashboard.keywords,

        updatedAt: dashboard.updatedAt,
        createdAt: dashboard.createdAt,

        widgets: widgets.map(
            (widget) =>
                ({
                    id: widget.id,
                    type: widget.type,
                    title: widget.title,
                    description: widget.description,
                    width: widget.width,
                    height: widget.height,
                    x: widget.x,
                    y: widget.y,
                    dataSource: widget.dataSource,
                    dataType: widget.dataType,
                    axis1: widget.axis1,
                    axis2: widget.axis2,
                    axis3: widget.axis3,
                }) satisfies WidgetAPI,
        ),
    } satisfies DashboardAPI;
}

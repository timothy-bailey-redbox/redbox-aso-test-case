import { type Config } from "@netlify/functions";
import { type UserAuth } from "netlify/lib/auth";
import { uiDb } from "netlify/lib/db";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import functionHandler, { HTTPResponseError } from "netlify/lib/handler";
import { parseWithSchema } from "netlify/lib/parser";
import { DashboardAPISchema, type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetAPISchema, type WidgetDB } from "types/widget";
import { z } from "zod";

export const config: Config = {
    path: "/api/dashboards/:dashboardId",
};

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            const dashboardId = parseWithSchema(context.params.dashboardId, z.string().uuid());
            const [dashboard, widgets] = await getDashboard(dashboardId, user);

            return {
                body: dashboardDBToAPI(dashboard, widgets),
            };
        },

        patch: async (req, context, user) => {
            const dashboardId = parseWithSchema(context.params.dashboardId, z.string().uuid());
            const [dashboard, widgets] = await getDashboard(dashboardId, user);

            const schema = DashboardAPISchema.partial()
                .omit({ widgets: true })
                .extend({
                    widgets: z
                        .array(
                            WidgetAPISchema.partial()
                                .required({ id: true })
                                .or(
                                    WidgetAPISchema.omit({
                                        id: true,
                                    }).extend({
                                        id: z.undefined().optional(),
                                    }),
                                ),
                        )
                        .optional(),
                });
            const changes = parseWithSchema(await req.json(), schema);

            await uiDb.transaction(async (queryFn) => {
                await queryFn(
                    `UPDATE "dashboards"
                    SET
                        "appId" = $2,
                        "appType" = $3,
                        "comparisonAppIds" = $4,
                        "description" = $5,
                        "keywords" = $6,
                        "name" = $7,
                        "status" = $8,
                        "teamId" = $9
                    WHERE "id" = $1`,
                    [
                        dashboard.id,
                        changes.appId ?? dashboard.appId,
                        changes.appType ?? dashboard.appType,
                        changes.comparisonAppIds ?? dashboard.comparisonAppIds,
                        changes.description ?? dashboard.description,
                        changes.keywords ?? dashboard.keywords,
                        changes.name ?? dashboard.name,
                        changes.status ?? dashboard.status,
                        changes.teamId ?? dashboard.teamId,
                    ],
                );

                const widgetChanges = changes.widgets;
                if (Array.isArray(widgetChanges)) {
                    const removedWidgets = widgets.filter((w1) => !widgetChanges.some((w2) => w1.id === w2.id));
                    await queryFn(
                        `UPDATE "widgets"
                        SET "dashboardId" = -1
                        WHERE "id" = ANY($1)`,
                        [removedWidgets.map((w) => w.id)],
                    );

                    const changedWidgets = widgetChanges.filter((w1) => widgets.some((w2) => w1.id === w2.id));
                    for (const widgetChange of changedWidgets) {
                        const widget = widgets.find((w) => w.id === widgetChange.id);
                        await queryFn(
                            `UPDATE "widgets"
                            SET
                                "axis1" = $3
                                "axis2" = $4
                                "axis3" = $5
                                "dataSource" = $6
                                "dataType" = $7
                                "height" = $8
                                "title" = $9
                                "type" = $10
                                "width" = $11
                                "x" = $12
                                "y" = $13
                            WHERE "id" = $1
                            AND "dashboardId" = $2`,
                            [
                                widgetChange.id,
                                dashboard.id,
                                widgetChange.axis1 ?? widget?.axis1,
                                widgetChange.axis2 ?? widget?.axis2,
                                widgetChange.axis3 ?? widget?.axis3,
                                widgetChange.dataSource ?? widget?.dataSource,
                                widgetChange.dataType ?? widget?.dataType,
                                widgetChange.height ?? widget?.height,
                                widgetChange.title ?? widget?.title,
                                widgetChange.type ?? widget?.type,
                                widgetChange.width ?? widget?.width,
                                widgetChange.x ?? widget?.x,
                                widgetChange.y ?? widget?.y,
                            ],
                        );
                    }

                    const addedWidgets = widgetChanges.filter((w1) => !w1.id || !widgets.some((w2) => w1.id === w2.id));
                    for (const widget of addedWidgets) {
                        await queryFn(
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
                                dashboard.id,
                                widget.type,
                                widget.dataSource,
                                widget.dataType,
                                widget.title,
                                widget.description,
                                widget.axis1,
                                widget.axis2,
                                widget.axis3,
                                widget.height,
                                widget.width,
                                widget.x,
                                widget.y,
                            ],
                        );
                    }
                }
            });

            const [updatedDashboard, updatedWidgets] = await getDashboard(dashboardId, user);

            return {
                statusCode: 201,
                body: dashboardDBToAPI(updatedDashboard, updatedWidgets),
            };
        },
    },
});

async function getDashboard(dashboardId: string, user: UserAuth): Promise<[DashboardDB, WidgetDB[]]> {
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

    if (!dashboard) {
        throw new HTTPResponseError(404, "Dashboard was not found");
    }

    const widgets = await uiDb.select<WidgetDB>(
        `SELECT *
        FROM widgets
        WHERE "dashboardId" = $1`,
        [dashboardId],
    );

    return [dashboard, widgets];
}

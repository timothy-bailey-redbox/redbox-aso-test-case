import { type Config } from "@netlify/functions";
import { assertIsAdmin } from "netlify/lib/auth";
import { writeInsertQuery } from "netlify/lib/db";
import uiDb, { getDashboard } from "netlify/lib/db/uiDb";
import { dashboardDBToAPI } from "netlify/lib/dto/dashboard";
import functionHandler from "netlify/lib/handler";
import { parseWithSchema } from "netlify/lib/parser";
import { DashboardAPISchema } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetAPISchema, WidgetDBSchema } from "types/widget";
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
            assertIsAdmin(user);

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
                        "appId" = :appId,
                        "appType" = :appType,
                        "comparisonAppIds" = :comparisonAppIds,
                        "description" = :description,
                        "keywords" = :keywords,
                        "name" = :name,
                        "status" = :status,
                        "teamId" = :teamId,
                        "updatedAt" = CURRENT_TIMESTAMP
                    WHERE "id" = :dashboardId`,
                    {
                        dashboardId: dashboard.id,
                        appId: changes.appId ?? dashboard.appId,
                        appType: changes.appType ?? dashboard.appType,
                        comparisonAppIds: changes.comparisonAppIds ?? dashboard.comparisonAppIds,
                        description: changes.description ?? dashboard.description,
                        keywords: changes.keywords ?? dashboard.keywords,
                        name: changes.name ?? dashboard.name,
                        status: changes.status ?? dashboard.status,
                        teamId: changes.teamId ?? dashboard.teamId,
                    },
                );

                const widgetChanges = changes.widgets;
                if (Array.isArray(widgetChanges)) {
                    const removedWidgets = widgets.filter((w1) => !widgetChanges.some((w2) => w1.id === w2.id));
                    await queryFn(
                        `DELETE FROM "widgets"
                        WHERE "id" = ANY(:removedIds)`,
                        {
                            removedIds: removedWidgets.map((w) => w.id),
                        },
                    );

                    const changedWidgets = widgetChanges.filter((w1) => widgets.some((w2) => w1.id === w2.id));
                    for (const widgetChange of changedWidgets) {
                        const widget = widgets.find((w) => w.id === widgetChange.id);
                        await queryFn(
                            `UPDATE "widgets"
                            SET
                                "axis1" = :axis1,
                                "axis2" = :axis2,
                                "axis3" = :axis3,
                                "dataSource" = :dataSource,
                                "dataType" = :dataType,
                                "height" = :height,
                                "title" = :title,
                                "type" = :type,
                                "width" = :width,
                                "x" = :x,
                                "y" = :y
                            WHERE "id" = :widgetId
                            AND "dashboardId" = :dashboardId`,
                            {
                                widgetId: widgetChange.id,
                                dashboardId: dashboard.id,
                                axis1: widgetChange.axis1 ?? widget?.axis1,
                                axis2: widgetChange.axis2 ?? widget?.axis2,
                                axis3: widgetChange.axis3 ?? widget?.axis3,
                                dataSource: widgetChange.dataSource ?? widget?.dataSource,
                                dataType: widgetChange.dataType ?? widget?.dataType,
                                height: widgetChange.height ?? widget?.height,
                                title: widgetChange.title ?? widget?.title,
                                type: widgetChange.type ?? widget?.type,
                                width: widgetChange.width ?? widget?.width,
                                x: widgetChange.x ?? widget?.x,
                                y: widgetChange.y ?? widget?.y,
                            },
                        );
                    }

                    const addedWidgets = widgetChanges.filter((w1) => !w1.id || !widgets.some((w2) => w1.id === w2.id));
                    for (const widget of addedWidgets) {
                        await queryFn(writeInsertQuery(WidgetDBSchema, "widgets", ["id"]), {
                            dashboardId: dashboard.id,
                            ...widget,
                        });
                    }
                }
            });

            const [updatedDashboard, updatedWidgets] = await getDashboard(dashboardId, user);

            return {
                statusCode: 200,
                body: dashboardDBToAPI(updatedDashboard, updatedWidgets),
            };
        },

        delete: async (req, context, user) => {
            assertIsAdmin(user);
            const dashboardId = parseWithSchema(context.params.dashboardId, z.string().uuid());

            await uiDb.mutate(
                `UPDATE "dashboards"
                SET
                    "status" = :status,
                    "updatedAt" = CURRENT_TIMESTAMP
                WHERE "id" = :dashboardId`,
                {
                    dashboardId,
                    status: StatusSchema.Values.DELETED,
                },
            );

            return {};
        },
    },
});

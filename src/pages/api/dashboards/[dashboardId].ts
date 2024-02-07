import { DashboardAPIUpdateSchema } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { WidgetDBSchema } from "types/widget";
import { z } from "zod";
import { assertIsAdmin } from "~/api/auth";
import { writeInsertQuery } from "~/api/db";
import uiDb, { getDashboard } from "~/api/db/uiDb";
import { dashboardDBToAPI } from "~/api/dto/dashboard";
import functionHandler from "~/api/handler";
import { parseWithSchema } from "~/api/parser";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, user) => {
            const dashboardId = parseWithSchema(req.query.dashboardId, z.string().uuid());
            const [dashboard, widgets] = await getDashboard(dashboardId, user);

            return {
                body: dashboardDBToAPI(dashboard, widgets),
            };
        },

        patch: async (req, user) => {
            assertIsAdmin(user);

            const dashboardId = parseWithSchema(req.query.dashboardId, z.string().uuid());
            const [dashboard, widgets] = await getDashboard(dashboardId, user);

            const changes = parseWithSchema(req.body, DashboardAPIUpdateSchema);

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
                                "dataFilter" = :dataFilter,
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
                                dataFilter: widgetChange.dataFilter ?? widget?.dataFilter,
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
                            axis2: null,
                            axis3: null,
                            description: null,
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

        delete: async (req, user) => {
            assertIsAdmin(user);
            const dashboardId = parseWithSchema(req.query.dashboardId, z.string().uuid());

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

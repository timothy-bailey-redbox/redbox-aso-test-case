import { type DashboardAPI, type DashboardDB } from "types/dashboard";
import { type WidgetAPI, type WidgetDB } from "types/widget";
import { HTTPResponseError } from "../handler";

export function dashboardDBToAPI(dashboard?: DashboardDB, widgets: WidgetDB[] = []): DashboardAPI {
    if (!dashboard) {
        throw new HTTPResponseError(404, "Missing dashboard data to convert to response");
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
                    dataFilter: widget.dataFilter,
                    axis1: widget.axis1,
                    axis2: widget.axis2,
                    axis3: widget.axis3,
                }) satisfies WidgetAPI,
        ),
    } satisfies DashboardAPI;
}

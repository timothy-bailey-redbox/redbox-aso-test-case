import { type DashboardDB } from "types/dashboard";
import { StatusSchema } from "types/generic";
import { type Team } from "types/team";
import { type WidgetDB } from "types/widget";
import { isAdmin, type UserAuth } from "../auth";
import { HTTPResponseError } from "../handler";
import DBConnector from "./dbConnector";

const uiDb = new DBConnector({
    user: process.env.UI_DB_USERNAME,
    host: process.env.UI_DB_HOST,
    database: process.env.UI_DB_NAME,
    password: process.env.UI_DB_PASSWORD,
    port: parseInt(process.env.UI_DB_PORT ?? "5432", 10),
});
export default uiDb;

export async function getDashboard(dashboardId: string, user: UserAuth): Promise<[DashboardDB, WidgetDB[]]> {
    const userIsAdmin = isAdmin(user);

    const [dashboard] = await uiDb.select<DashboardDB>(
        `SELECT d.*
        FROM "dashboards" d
        INNER JOIN "teams" t ON t.id = d."teamId"
        WHERE d."id" = :dashboardId
        AND (:email::text = ANY(t.users) OR :userIsAdmin::boolean = true)
        AND d."status" = :active
        AND t."status" = :active`,
        {
            dashboardId,
            email: user.email,
            userIsAdmin,
            active: StatusSchema.Values.ACTIVE,
        },
    );

    if (!dashboard) {
        throw new HTTPResponseError(404, "Dashboard was not found");
    }

    const widgets = await uiDb.select<WidgetDB>(
        `SELECT *
        FROM "widgets"
        WHERE "dashboardId" = :dashboardId`,
        { dashboardId },
    );

    return [dashboard, widgets];
}

export async function getDashboards(user: UserAuth): Promise<[DashboardDB, WidgetDB[]][]> {
    const userIsAdmin = isAdmin(user);

    const dashboards: [DashboardDB, WidgetDB[]][] = [];

    const dashboardsData = await uiDb.select<DashboardDB>(
        `SELECT d.*
        FROM "dashboards" d
        INNER JOIN "teams" t ON t.id = d."teamId"
        WHERE (:email::text = ANY(t.users) OR :userIsAdmin::boolean = true)
        AND d."status" = :active
        AND t."status" = :active`,
        {
            email: user.email,
            userIsAdmin,
            active: StatusSchema.Values.ACTIVE,
        },
    );

    for (const dashboard of dashboardsData) {
        const widgets = await uiDb.select<WidgetDB>(
            `SELECT *
            FROM "widgets"
            WHERE "dashboardId" = :dashboardId`,
            {
                dashboardId: dashboard.id,
            },
        );

        dashboards.push([dashboard, widgets]);
    }

    return dashboards;
}

export async function getTeams(user: UserAuth): Promise<Team[]> {
    const userIsAdmin = isAdmin(user);

    const teams = await uiDb.select<Team>(
        `SELECT *
        FROM "teams"
        WHERE (:email::text = ANY(users) OR :userIsAdmin::boolean = true)
        AND "status" = :active`,
        {
            email: user.email,
            userIsAdmin,
            active: StatusSchema.Values.ACTIVE,
        },
    );

    return teams;
}

export async function getTeam(teamId: string, user: UserAuth): Promise<Team> {
    const userIsAdmin = isAdmin(user);

    const [team] = await uiDb.select<Team>(
        `SELECT *
        FROM "teams"
        WHERE (:email::text = ANY(users) OR :userIsAdmin::boolean = true)
        AND "status" = :active
        AND "id" = :teamId`,
        {
            email: user.email,
            userIsAdmin,
            active: StatusSchema.Values.ACTIVE,
            teamId,
        },
    );

    if (!team) {
        throw new HTTPResponseError(404, "Team was not found");
    }

    return team;
}

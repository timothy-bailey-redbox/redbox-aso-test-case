import "dotenv/config";
import DBConnector from "../netlify/lib/dbConnector";
console.log("DB table creation");

const db = new DBConnector({
    user: process.env.UI_DB_USERNAME,
    host: process.env.UI_DB_HOST,
    database: process.env.UI_DB_NAME,
    password: process.env.UI_DB_PASSWORD,
    port: parseInt(process.env.UI_DB_PORT ?? "5432", 10),
});

try {
    await db.select("BEGIN", []);

    console.log("Enums");
    await db.select(`CREATE TYPE "StatusType" AS ENUM ('ACTIVE', 'DELETED');`, []);
    await db.select(`CREATE TYPE "AppType" AS ENUM ('IOS', 'ANDROID');`, []);

    console.log("Teams");
    await db.select(
        `CREATE TABLE "teams"(
            "id"                    UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            "name"                  TEXT            NOT NULL,
            "users"                 TEXT[]          NOT NULL,
            "status"                "StatusType"    NOT NULL,
            "createdAt"             TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt"             TIMESTAMP(3)    NOT NULL
        );`,
        [],
    );

    console.log("Dashboards");
    await db.select(
        `CREATE TABLE "dashboards"(
            "id"                    UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            "name"                  TEXT            NOT NULL,
            "status"                "StatusType"    NOT NULL,
            "description"           TEXT,
            "teamId"                UUID            NOT NULL,
            "appId"                 TEXT            NOT NULL,
            "comparisonAppIds"      TEXT[]          NOT NULL,
            "appType"               "AppType"       NOT NULL,
            "createdAt"             TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt"             TIMESTAMP(3)    NOT NULL,

            CONSTRAINT "fk_teamId" FOREIGN KEY("teamId") REFERENCES "teams"("id")
        );`,
        [],
    );

    console.log("Widgets");
    await db.select(
        `CREATE TABLE "widgets"(
            "id"                    UUID            NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
            "dashboardId"           UUID            NOT NULL,
            "type"                  TEXT            NOT NULL,
            "dataSource"            TEXT            NOT NULL,
            "dataType"              TEXT            NOT NULL,
            "axis1"                 TEXT            NOT NULL,
            "axis2"                 TEXT,
            "axis3"                 TEXT,
            "title"                 TEXT            NOT NULL,
            "description"           TEXT,
            "width"                 SMALLINT        NOT NULL,
            "height"                SMALLINT        NOT NULL,
            "x"                     SMALLINT        NOT NULL,
            "y"                     SMALLINT        NOT NULL,
            
            CONSTRAINT "fk_dashboardId" FOREIGN KEY("dashboardId") REFERENCES "dashboards"("id")
        )`,
        [],
    );

    await db.select("COMMIT", []);
} catch (err) {
    console.error(err);
    await db.select("ROLLBACK", []);
}

console.log("Tables created");

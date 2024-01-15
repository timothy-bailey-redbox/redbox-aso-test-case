import "dotenv/config";
import { uiDb } from "netlify/lib/db";

console.log("DB table creation");

await uiDb.transaction(async (queryFn) => {
    console.log("Enums");
    await queryFn(`CREATE TYPE "StatusType" AS ENUM ('ACTIVE', 'DELETED');`, []);
    await queryFn(`CREATE TYPE "AppType" AS ENUM ('IOS', 'ANDROID');`, []);

    console.log("Teams");
    await queryFn(
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
    await queryFn(
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
    await queryFn(
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
});

console.log("Tables created");

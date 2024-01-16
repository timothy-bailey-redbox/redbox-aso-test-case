import { type Context, type Config } from "@netlify/functions";
import { uiDb } from "netlify/lib/db";
import { StatusSchema } from "types/generic";
import { doFetch } from "~/lib/doFetch";

export default async function Sync(_req: Request, _context: Context): Promise<Response> {
    const appDataToSync = await uiDb.select<{
        appId: string;
        keywords: string[];
    }>(
        `
        SELECT "appId", array_agg("keywords") as "keywords"
        FROM (
            SELECT DISTINCT d."appId", unnest(d."keywords") as "keywords"
            FROM "dashboards" d
            INNER JOIN "teams" t ON t."id" = d."teamId"
            WHERE d."status" = $1
            AND t."status" = $1

            UNION DISTINCT

            SELECT DISTINCT unnest(d."comparisonAppIds") as "appId", unnest(d."keywords") as "keywords"
            FROM "dashboards" d
            INNER JOIN "teams" t ON t."id" = d."teamId"
            WHERE d."status" = $1
            AND t."status" = $1
        )
        GROUP BY "appId"`,
        [StatusSchema.Values.ACTIVE],
    );

    await doFetch({
        url: "https://jakubs.api/sync/these/apps",
        method: "POST",
        body: appDataToSync,
    });

    console.log("Background sync triggered with data: \n", appDataToSync);

    return new Response(JSON.stringify(appDataToSync));
}

export const config: Config = {
    // TODO: Uncomment this when the service is tested and ready to run on schedule
    //schedule: "@daily",
};

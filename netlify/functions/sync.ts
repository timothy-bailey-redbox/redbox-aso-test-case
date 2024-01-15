import { type Handler, type HandlerContext, type HandlerEvent, type HandlerResponse } from "@netlify/functions";
import { uiDb } from "netlify/lib/db";
import { StatusSchema } from "types/generic";
import { doFetch } from "~/lib/doFetch";

const handler: Handler = async (_event: HandlerEvent, _context: HandlerContext): Promise<HandlerResponse> => {
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
    return {
        statusCode: 200,
        body: JSON.stringify(appDataToSync),
    };
};

export { handler };

// TODO: Uncomment this when the service is tested and ready to run on schedule
// export const config: Config = {
//     schedule: "@daily",
// };

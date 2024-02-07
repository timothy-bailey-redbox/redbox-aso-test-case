import { type Config } from "@netlify/functions";
import { type NextApiRequest, type NextApiResponse } from "next";
import { StatusSchema } from "types/generic";
import uiDb from "~/api/db/uiDb";
import { doFetch } from "~/lib/doFetch";

export const config: Config = {
    // TODO: Uncomment this when the service is tested and ready to run on schedule
    // type: "experimental-scheduled",
    // schedule: "@daily",
};

export default async function sync(_req: NextApiRequest, _res: NextApiResponse) {
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
            WHERE d."status" = :active
            AND t."status" = :active

            UNION DISTINCT

            SELECT DISTINCT unnest(d."comparisonAppIds") as "appId", unnest(d."keywords") as "keywords"
            FROM "dashboards" d
            INNER JOIN "teams" t ON t."id" = d."teamId"
            WHERE d."status" = :active
            AND t."status" = :active
        )
        GROUP BY "appId"`,
        { active: StatusSchema.Values.ACTIVE },
    );

    await doFetch({
        url: "https://jakubs.api/sync/these/apps",
        method: "POST",
        body: appDataToSync,
    });

    console.log("Background sync triggered with data: \n", appDataToSync);

    return new Response(JSON.stringify(appDataToSync));
}

import "dotenv/config";
import uiDb from "~/lib/api/db/uiDb";

await uiDb.mutate(`ALTER TABLE "dashboards" ADD "keywords" TEXT[] NOT NULL;`, {});

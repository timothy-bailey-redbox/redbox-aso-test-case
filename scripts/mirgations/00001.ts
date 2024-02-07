import "dotenv/config";
import uiDb from "~/api/db/uiDb";

await uiDb.mutate(`ALTER TABLE "dashboards" ADD "keywords" TEXT[] NOT NULL;`, {});

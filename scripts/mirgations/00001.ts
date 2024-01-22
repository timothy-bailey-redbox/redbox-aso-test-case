import "dotenv/config";
import uiDb from "netlify/lib/db/uiDb";

await uiDb.mutate(`ALTER TABLE "dashboards" ADD "keywords" TEXT[] NOT NULL;`, {});

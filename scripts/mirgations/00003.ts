import "dotenv/config";
import uiDb from "netlify/lib/db/uiDb";

await uiDb.mutate(`ALTER TABLE "widgets" ALTER COLUMN "dataType" TYPE TEXT[] USING ("dataType"::TEXT[]);`, {});
await uiDb.mutate(`ALTER TABLE "widgets" RENAME COLUMN "dataType" TO "dataFilter";`, {});

import "dotenv/config";
import uiDb from "~/api/db/uiDb";

await uiDb.mutate(`ALTER TABLE "dashboards" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;`, {});
await uiDb.mutate(`ALTER TABLE "teams" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;`, {});

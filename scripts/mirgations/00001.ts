import "dotenv/config";
import { uiDb } from "netlify/lib/db";

await uiDb.mutate(`ALTER TABLE "dashboards" ADD "keywords" TEXT[] NOT NULL;`, []);

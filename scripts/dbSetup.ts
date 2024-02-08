import "dotenv/config";
import uiDb from "~/lib/api/db/uiDb";
console.log("DB Setup");

await uiDb.mutate(`CREATE DATABASE "${process.env.UI_DB_NAME}"`, {});

console.log("Database created");

import "dotenv/config";
import uiDb from "~/api/db/uiDb";
console.log("DB Setup");

await uiDb.mutate(`CREATE DATABASE "${process.env.UI_DB_NAME}"`, {});

console.log("Database created");

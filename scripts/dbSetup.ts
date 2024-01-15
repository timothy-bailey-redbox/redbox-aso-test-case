import "dotenv/config";
import { uiDb } from "netlify/lib/db";
console.log("DB Setup");

await uiDb.mutate(`CREATE DATABASE "${process.env.UI_DB_NAME}"`, []);

console.log("Database created");

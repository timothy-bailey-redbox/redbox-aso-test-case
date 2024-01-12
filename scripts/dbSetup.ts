import "dotenv/config";
import { uiDb } from "netlify/lib/db";
console.log("DB Setup");

try {
    await uiDb.mutate(`CREATE DATABASE "${process.env.UI_DB_NAME}"`, []);
} catch (err) {
    console.error(err);
}

console.log("Database created");

import "dotenv/config";
import DBConnector from "../netlify/lib/dbConnector";
console.log("DB Setup");

try {
    const db = new DBConnector({
        user: process.env.UI_DB_USERNAME,
        host: process.env.UI_DB_HOST,
        password: process.env.UI_DB_PASSWORD,
        port: parseInt(process.env.UI_DB_PORT ?? "5432", 10),
    });

    await db.mutate(`CREATE DATABASE "${process.env.UI_DB_NAME}"`, []);
} catch (err) {
    console.error(err);
}

console.log("Database created");

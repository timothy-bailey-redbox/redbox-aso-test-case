import DBConnector from "./dbConnector";

export const uiDb = new DBConnector({
    user: process.env.UI_DB_USERNAME,
    host: process.env.UI_DB_HOST,
    database: process.env.UI_DB_NAME,
    password: process.env.UI_DB_PASSWORD,
    port: parseInt(process.env.UI_DB_PORT ?? "5432", 10),
});

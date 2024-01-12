import DBConnector from "./dbConnector";

export const uiDb = new DBConnector({
    user: Netlify.env.get("UI_DB_USERNAME"),
    host: Netlify.env.get("UI_DB_HOST"),
    database: Netlify.env.get("UI_DB_NAME"),
    password: Netlify.env.get("UI_DB_PASSWORD"),
    port: parseInt(Netlify.env.get("UI_DB_PORT") ?? "5432", 10),
});

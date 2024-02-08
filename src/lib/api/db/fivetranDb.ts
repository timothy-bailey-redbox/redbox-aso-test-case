import DBConnector from "./dbConnector";

const fivetranDb = new DBConnector({
    user: process.env.FIVETRAN_DB_USERNAME,
    host: process.env.FIVETRAN_DB_HOST,
    database: process.env.FIVETRAN_DB_NAME,
    password: process.env.FIVETRAN_DB_PASSWORD,
    port: parseInt(process.env.FIVETRAN_DB_PORT ?? "5432", 10),
});
export default fivetranDb;

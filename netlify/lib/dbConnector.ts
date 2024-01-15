import pg from "pg";

export default class DBConnector {
    private client: pg.Pool;

    constructor(props: pg.PoolConfig) {
        this.client = new pg.Pool({
            ...props,
            log: console.log,
        });
        process.on("beforeExit", () => {
            void this.client.end();
        });
        process.on("SIGINT", () => {
            void this.client.end();
        });
    }

    async select<TRow extends pg.QueryResultRow>(query: string, parameters: unknown[]): Promise<TRow[]> {
        const request = await this.client.query<TRow>(query, parameters);
        return request.rows;
    }

    async mutate<TRow extends pg.QueryResultRow>(query: string, parameters: unknown[]): Promise<TRow[]> {
        try {
            await this.client.query("BEGIN");
            const response = await this.client.query<TRow>(query, parameters);
            await this.client.query("COMMIT");
            return response.rows;
        } catch (e) {
            await this.client.query("ROLLBACK");
            throw e;
        }
    }
}

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
        return await this.transaction<TRow[]>(async (queryFn) => {
            return await queryFn(query, parameters);
        });
    }

    async transaction<TReturn>(operation: (queryFn: typeof this.select) => Promise<TReturn>): Promise<TReturn> {
        let result: TReturn;
        try {
            await this.client.query("BEGIN");
            result = await operation(this.select.bind(this));
            await this.client.query("COMMIT");
        } catch (e) {
            await this.client.query("ROLLBACK");
            throw e;
        }
        return result;
    }
}

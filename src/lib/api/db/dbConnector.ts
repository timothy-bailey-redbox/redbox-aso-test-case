import pg from "pg";

const parseDate = (val: string | null) => (val !== null ? new Date(val).getTime() : val);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMP, parseDate);
pg.types.setTypeParser(pg.types.builtins.TIMESTAMPTZ, parseDate);
pg.types.setTypeParser(pg.types.builtins.DATE, parseDate);

// This is technically not correct, INT8 is 64bit and JS only supports 52bit ints.
// I am accepting that loss of precision for simplicity of implementation, and I doubt
// the DB will ever actually give me something >2^52. We should use BigInt but they don't
// serialise to JSON for sending via API.
pg.types.setTypeParser(pg.types.builtins.INT8, (int: string) => parseInt(int, 10));

type Parameters = Record<string, unknown>;

export default class DBConnector {
    private pool: pg.Pool;

    constructor(props: pg.PoolConfig) {
        this.pool = new pg.Pool({
            ...props,
            log: console.log,
        });
        process.on("beforeExit", () => {
            void this.pool.end();
        });
        process.on("SIGINT", () => {
            void this.pool.end();
        });
    }

    async select<TRow extends pg.QueryResultRow>(query: string, parameters: Parameters): Promise<TRow[]> {
        const [q, params] = this.parametrizeQuery(query, parameters);
        try {
            const request = await this.pool.query<TRow>(q, params);
            return request.rows;
        } catch (err) {
            if (err instanceof Error) {
                err.message += ` --- \`\`\`${q}\`\`\` --- ${JSON.stringify(params)}`;
            }
            throw err;
        }
    }

    async mutate<TRow extends pg.QueryResultRow>(query: string, parameters: Parameters): Promise<TRow[]> {
        return await this.transaction<TRow[]>(async (queryFn) => {
            return await queryFn(query, parameters);
        });
    }

    async transaction<TReturn>(operation: (queryFn: typeof this.select) => Promise<TReturn>): Promise<TReturn> {
        let result: TReturn;
        const connection = await this.pool.connect();
        try {
            await connection.query("BEGIN");
            result = await operation(this.select.bind(this));
            await connection.query("COMMIT");
        } catch (e) {
            await connection.query("ROLLBACK");
            throw e;
        } finally {
            connection.release();
        }
        return result;
    }

    private parametrizeQuery(rawQuery: string, parameterSet: Parameters): [string, unknown[]] {
        let paramQuery = rawQuery;
        const params: unknown[] = [];
        for (const [key, value] of Object.entries(parameterSet)) {
            if (paramQuery.includes(`:${key}`)) {
                params.push(value);
                paramQuery = paramQuery.replaceAll(`:${key}`, `$${params.length}`);
            }
        }

        return [paramQuery, params];
    }
}

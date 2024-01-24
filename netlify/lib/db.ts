import { type z } from "zod";

export function writeInsertQuery<T extends z.AnyZodObject>(
    schema: T,
    tableName: string,
    omitKeys: (keyof z.infer<T>)[] = [],
): string {
    let query = `INSERT INTO "${tableName}"(\n`;

    const schemaKeys: (keyof z.infer<T>)[] = Object.values(schema.keyof().Values);
    const keys = schemaKeys.filter((key) => !omitKeys.includes(key));

    query += keys.map((key) => `"${String(key)}"`).join(",\n");
    query += ")\nVALUES(\n";
    query += keys.map((key) => `:${String(key)}`).join(",\n");
    query += ") RETURNING *;";

    return query;
}

import { type z } from "zod";
import { HTTPResponseError } from "./handler";

export function parseJSONWithSchema<T>(json: string | null, schema: z.ZodType<T>): T {
    try {
        return schema.parse(JSON.parse(json ?? "{}"));
    } catch (err) {
        throw new HTTPResponseError(400, err instanceof Error ? err.message : "", { cause: err });
    }
}

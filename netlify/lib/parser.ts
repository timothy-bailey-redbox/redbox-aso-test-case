import { type z } from "zod";
import { HTTPResponseError } from "./handler";

export function parseWithSchema<T>(str: unknown, schema: z.ZodType<T>, statusCode = 400): T {
    try {
        return schema.parse(str);
    } catch (err) {
        throw new HTTPResponseError(statusCode, err instanceof Error ? err.message : "", { cause: err });
    }
}

export function parseJSONWithSchema<T>(json: string | null | undefined, schema: z.ZodType<T>, statusCode?: number): T {
    return parseWithSchema(JSON.parse(json ?? "{}"), schema, statusCode);
}

export function parseQueryString(request: Request) {
    const url = new URL(request.url);
    return Object.fromEntries(url.searchParams.entries());
}

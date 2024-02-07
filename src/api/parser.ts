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

export function parseQueryStringArray(parameter: string[] | string | undefined) {
    if (!parameter) {
        return [];
    }
    if (Array.isArray(parameter)) {
        return parameter;
    }
    if (parameter.includes(",")) {
        return parameter.split(",");
    }
    return [parameter];
}

export function parseQueryStringInt(parameter: string[] | string | undefined) {
    if (!parameter) {
        return NaN;
    }
    if (Array.isArray(parameter)) {
        return NaN;
    }
    return parseInt(parameter, 10);
}

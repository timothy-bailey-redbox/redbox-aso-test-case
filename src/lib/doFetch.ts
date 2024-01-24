import { type z } from "zod";

type DoFetchConfigBase = {
    url: string;
    body?: string | object;
    method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
    bearer?: string;
    returnType?: "text" | "json";
};

type DoFetchConfigJSON<TSchema extends z.ZodSchema<TReturn>, TReturn> = DoFetchConfigBase & {
    returnType: "json";
    schema: TSchema;
};
type DoFetchConfigText = DoFetchConfigBase & {
    returnType: "text";
};
type DoFetchConfigNull = DoFetchConfigBase & {
    returnType?: undefined;
};

export type doFetchConfig<TSchema extends z.ZodSchema, TReturn> =
    | DoFetchConfigJSON<TSchema, TReturn>
    | DoFetchConfigText
    | DoFetchConfigNull;

export async function doFetch<TSchema extends z.ZodSchema<TReturn>, TReturn>(
    opts: DoFetchConfigJSON<TSchema, TReturn>,
): Promise<z.infer<TSchema>>;
export async function doFetch(opts: DoFetchConfigText): Promise<string>;
export async function doFetch(opts: DoFetchConfigNull): Promise<void>;
export async function doFetch<TSchema extends z.ZodSchema<TReturn>, TReturn>(
    opts: doFetchConfig<TSchema, TReturn>,
): Promise<z.infer<TSchema> | string | void> {
    let contentType = null;
    let body = null;
    if (typeof opts.body === "string") {
        contentType = "text/plain";
        body = opts.body;
    } else if (!!opts.body) {
        contentType = "application/json";
        body = JSON.stringify(opts.body);
    }

    const headers: Record<string, string> = {};
    if (contentType) {
        headers["Content-Type"] = contentType;
    }

    if (opts.bearer) {
        headers.Authorization = "Bearer " + opts.bearer;
    }

    const req = await fetch(opts.url, {
        method: opts.method,
        body,
        headers,
    });

    const rawBody = await req.text();

    if (req.status > 299) {
        let message: Error | object = new Error(rawBody);
        try {
            message = JSON.parse(rawBody) as object;
        } catch (err) {
            // Don't care, we attempted to parse as json
        }
        throw message;
    }

    let parsedBody: z.infer<TSchema> | string | void = undefined;
    if (rawBody && opts.returnType) {
        if (opts.returnType === "text") {
            parsedBody = rawBody;
        } else {
            parsedBody = opts.schema.parse(JSON.parse(rawBody));
        }
    }

    return parsedBody;
}

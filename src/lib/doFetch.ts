import { type z } from "zod";

type DoFetchConfigBase = {
    url: string;
    body?: string | object;
    method?: "GET" | "PUT" | "POST" | "PATCH" | "DELETE";
    bearer?: string;
    returnType?: "text" | "json";
};

type DoFetchConfigJSON<T> = DoFetchConfigBase & {
    returnType: "json";
    schema: z.ZodType<T>;
};
type DoFetchConfigText = DoFetchConfigBase & {
    returnType: "text";
    schema: never;
};
type DoFetchConfigNull = DoFetchConfigBase & {
    returnType: undefined;
    schema: never;
};

export type doFetchConfig<T> = DoFetchConfigJSON<T> | DoFetchConfigText | DoFetchConfigNull;

export async function doFetch<T>(opts: DoFetchConfigJSON<T>): Promise<z.infer<typeof opts.schema>>;
export async function doFetch(opts: DoFetchConfigText): Promise<string>;
export async function doFetch(opts: DoFetchConfigNull): Promise<void>;
export async function doFetch<T>(opts: doFetchConfig<T>): Promise<z.infer<typeof opts.schema> | string | void> {
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
            // void
        }
        throw message;
    }

    let parsedBody: z.infer<typeof opts.schema> | string | void = undefined;
    if (rawBody && opts.returnType) {
        if (opts.returnType === "text") {
            parsedBody = rawBody;
        } else {
            parsedBody = opts.schema.parse(JSON.parse(rawBody));
        }
    }

    return parsedBody;
}

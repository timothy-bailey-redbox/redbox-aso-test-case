import { type Context, type HandlerResponse } from "@netlify/functions";
import { getUser, isLoggedIn, type UserAuth } from "./auth";
import { apiHeaders, corsHeaders } from "./consts";

type ProxyHandlerResponse = Omit<HandlerResponse, "statusCode" | "body"> & {
    statusCode?: number;
    body?: string | object;
};

export class HTTPResponseError extends Error {
    statusCode: number;
    constructor(statusCode: number, message: string, options?: ErrorOptions) {
        super(message, options);
        this.statusCode = statusCode;
    }
}

type Handlers<TUser> = {
    get?: (req: Request, context: Context, user: TUser) => Promise<ProxyHandlerResponse>;
    put?: (req: Request, context: Context, user: TUser) => Promise<ProxyHandlerResponse>;
    post?: (req: Request, context: Context, user: TUser) => Promise<ProxyHandlerResponse>;
    patch?: (req: Request, context: Context, user: TUser) => Promise<ProxyHandlerResponse>;
    delete?: (req: Request, context: Context, user: TUser) => Promise<ProxyHandlerResponse>;
};

type Handler = (req: Request, context: Context) => Promise<Response>;

export default function functionHandler(config: { secure: true; handlers: Handlers<UserAuth> }): Handler;
export default function functionHandler(config: { secure: false; handlers: Handlers<UserAuth | null> }): Handler;
export default function functionHandler({
    secure,
    handlers,
}: {
    secure: boolean;
    handlers: Handlers<UserAuth> | Handlers<UserAuth | null>;
}): Handler {
    return async (req: Request, context: Context): Promise<Response> => {
        if (req.method === "OPTIONS") {
            const handlerTypes = Object.keys(handlers).map((method) => method.toLocaleUpperCase());
            return new Response(undefined, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Methods": ["OPTIONS", ...handlerTypes].join(", "),
                },
            });
        }

        if (secure && !isLoggedIn(req, context)) {
            return new Response(undefined, {
                status: 401,
                headers: corsHeaders,
            });
        }
        const user = getUser(req, context);

        let response: ProxyHandlerResponse = {
            statusCode: 405,
        };

        try {
            if (req.method === "GET" && !!handlers.get) {
                response = await handlers.get(req, context, user!);
            } else if (req.method === "PUT" && !!handlers.put) {
                response = await handlers.put(req, context, user!);
            } else if (req.method === "POST" && !!handlers.post) {
                response = await handlers.post(req, context, user!);
            } else if (req.method === "PATCH" && !!handlers.patch) {
                response = await handlers.patch(req, context, user!);
            } else if (req.method === "DELETE" && !!handlers.delete) {
                response = await handlers.delete(req, context, user!);
            }
        } catch (err) {
            let message = err;
            let status = 500;
            if (!!err && err instanceof Error) {
                message = {
                    name: err.name,
                    message: err.message,
                    stack: err.stack,
                    errors: [],
                };
                if (err instanceof AggregateError) {
                    // @ts-expect-error I know this object structure is fine, literally just set it
                    message.errors = err.errors;
                }
                if (err instanceof HTTPResponseError) {
                    status = err.statusCode;
                    // Remove the stack as this was very likely and handled error
                    // @ts-expect-error As above
                    delete message.stack;
                }
            }
            return new Response(JSON.stringify(message), {
                status,
                headers: apiHeaders,
            });
        }

        if (typeof response.body === "object") {
            return new Response(JSON.stringify(response.body), {
                status: response.statusCode,
                headers: {
                    ...apiHeaders,
                    "Content-Type": "application/json",
                    ...response.headers,
                },
            });
        }

        return new Response(response.body, {
            status: response.statusCode,
            headers: {
                ...apiHeaders,
                ...response.headers,
            },
        });
    };
}

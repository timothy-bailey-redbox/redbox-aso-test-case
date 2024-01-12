import { type Handler, type HandlerContext, type HandlerEvent, type HandlerResponse } from "@netlify/functions";
import { getUser, isLoggedIn, type UserAuth } from "./auth";
import { apiHeaders, corsHeaders } from "./consts";

type ProxyHandlerResponse = Omit<HandlerResponse, "statusCode"> & {
    statusCode?: number;
};

type Handlers<TUser> = {
    get?: (event: HandlerEvent, user: TUser) => Promise<ProxyHandlerResponse>;
    put?: (event: HandlerEvent, user: TUser) => Promise<ProxyHandlerResponse>;
    post?: (event: HandlerEvent, user: TUser) => Promise<ProxyHandlerResponse>;
    patch?: (event: HandlerEvent, user: TUser) => Promise<ProxyHandlerResponse>;
    delete?: (event: HandlerEvent, user: TUser) => Promise<ProxyHandlerResponse>;
};

export default function functionHandler(config: { secure: true; handlers: Handlers<UserAuth> }): Handler;
export default function functionHandler(config: { secure: false; handlers: Handlers<null> }): Handler;
export default function functionHandler({
    secure,
    handlers,
}: {
    secure: boolean;
    handlers: Handlers<UserAuth | null>;
}): Handler {
    return async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
        if (event.httpMethod === "OPTIONS") {
            const handlerTypes = Object.keys(handlers).map((method) => method.toLocaleUpperCase());
            return {
                statusCode: 204,
                headers: {
                    ...corsHeaders,
                    "Access-Control-Allow-Methods": ["OPTIONS", ...handlerTypes].join(", "),
                },
            };
        }

        if (secure && !isLoggedIn(context)) {
            return {
                statusCode: 401,
                headers: corsHeaders,
            };
        }
        const user = getUser(context);

        let response: ProxyHandlerResponse = {
            statusCode: 405,
        };

        try {
            if (event.httpMethod === "GET" && !!handlers.get) {
                response = await handlers.get(event, user);
            } else if (event.httpMethod === "PUT" && !!handlers.put) {
                response = await handlers.put(event, user);
            } else if (event.httpMethod === "POST" && !!handlers.post) {
                response = await handlers.post(event, user);
            } else if (event.httpMethod === "PATCH" && !!handlers.patch) {
                response = await handlers.patch(event, user);
            } else if (event.httpMethod === "DELETE" && !!handlers.delete) {
                response = await handlers.delete(event, user);
            }
        } catch (err) {
            let message = err;
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
            }
            return {
                statusCode: 500,
                body: JSON.stringify(message),
                headers: {
                    ...apiHeaders,
                },
            };
        }

        return {
            statusCode: 200,
            ...response,
            headers: {
                ...apiHeaders,
                ...response.headers,
            },
        };
    };
}

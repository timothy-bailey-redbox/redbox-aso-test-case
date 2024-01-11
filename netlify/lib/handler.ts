import { type HandlerEvent, type HandlerContext, type HandlerResponse, type Handler } from "@netlify/functions";
import { corsHeaders, apiHeaders } from "./consts";
import { type UserAuth, getUser, isLoggedIn } from "./auth";

type ProxyHandlerResponse = Omit<HandlerResponse, "statusCode"> & {
    statusCode?: number;
};

export default function functionHandler({
    secure,
    handlers,
}: {
    secure: boolean;
    handlers: {
        get?: (event: HandlerEvent, user: UserAuth | null) => Promise<ProxyHandlerResponse>;
        put?: (event: HandlerEvent, user: UserAuth | null) => Promise<ProxyHandlerResponse>;
        post?: (event: HandlerEvent, user: UserAuth | null) => Promise<ProxyHandlerResponse>;
        patch?: (event: HandlerEvent, user: UserAuth | null) => Promise<ProxyHandlerResponse>;
        delete?: (event: HandlerEvent, user: UserAuth | null) => Promise<ProxyHandlerResponse>;
    };
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
            return {
                statusCode: 500,
                body: JSON.stringify(err),
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

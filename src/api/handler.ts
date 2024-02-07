import { type NextApiRequest, type NextApiResponse } from "next";
import { getUser, isLoggedIn, type UserAuth } from "./auth";

type ProxyHandlerResponse = {
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
    get?: (req: NextApiRequest, user: TUser) => Promise<ProxyHandlerResponse>;
    put?: (req: NextApiRequest, user: TUser) => Promise<ProxyHandlerResponse>;
    post?: (req: NextApiRequest, user: TUser) => Promise<ProxyHandlerResponse>;
    patch?: (req: NextApiRequest, user: TUser) => Promise<ProxyHandlerResponse>;
    delete?: (req: NextApiRequest, user: TUser) => Promise<ProxyHandlerResponse>;
};

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;

export default function functionHandler(config: { secure: true; handlers: Handlers<UserAuth> }): Handler;
export default function functionHandler(config: { secure: false; handlers: Handlers<UserAuth | null> }): Handler;
export default function functionHandler({
    secure,
    handlers,
}: {
    secure: boolean;
    handlers: Handlers<UserAuth> | Handlers<UserAuth | null>;
}): Handler {
    return async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method === "OPTIONS") {
            const handlerTypes = Object.keys(handlers).map((method) => method.toLocaleUpperCase());
            res.status(204).setHeader("Access-Control-Allow-Methods", ["OPTIONS", ...handlerTypes].join(", "));
            return;
        }

        if (secure && !isLoggedIn(req)) {
            res.status(401);
            return;
        }

        const user = getUser(req);

        let response: ProxyHandlerResponse = {
            statusCode: 405,
        };

        try {
            if (req.method === "GET" && !!handlers.get) {
                response = await handlers.get(req, user!);
            } else if (req.method === "PUT" && !!handlers.put) {
                response = await handlers.put(req, user!);
            } else if (req.method === "POST" && !!handlers.post) {
                response = await handlers.post(req, user!);
            } else if (req.method === "PATCH" && !!handlers.patch) {
                response = await handlers.patch(req, user!);
            } else if (req.method === "DELETE" && !!handlers.delete) {
                response = await handlers.delete(req, user!);
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
                    // Remove the stack as this was very likely a handled error
                    // @ts-expect-error As above
                    delete message.stack;
                }
            }
            res.status(status).json(message);
            return;
        }

        if (typeof response.body === "object") {
            res.status(response.statusCode ?? 200).json(response.body);
            return;
        }

        res.status(response.statusCode ?? 200).send(response.body);
    };
}

import { type Handler, type HandlerEvent, type HandlerContext, type HandlerResponse } from "@netlify/functions";
import { apiHeaders } from "../lib/consts";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext): Promise<HandlerResponse> => {
    return {
        statusCode: 200,
        body: JSON.stringify({
            status: "OK",
            event,
            context,
        }),
        headers: apiHeaders,
    };
};

export { handler };

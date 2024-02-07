import { type Config, type Context } from "@netlify/functions";

export const config: Config = {
    //path: "/.netlify/functions/test",
};

export default async function test(req: Request, context: Context): Promise<Response> {
    await new Promise((resolve) => {
        setTimeout(resolve, 1000);
    });

    return new Response(
        JSON.stringify({
            test: "success",
            req,
            context,
        }),
    );
}

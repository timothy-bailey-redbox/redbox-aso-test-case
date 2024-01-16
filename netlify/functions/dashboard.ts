import { type Config } from "@netlify/functions";
import functionHandler from "netlify/lib/handler";

export default functionHandler({
    secure: true,
    handlers: {
        get: async (req, context, user) => {
            console.log({
                req,
                context,
                user,
            });

            return {};
        },
    },
});

export const config: Config = {
    path: "/api/get-dashboard/:dashboardId",
};

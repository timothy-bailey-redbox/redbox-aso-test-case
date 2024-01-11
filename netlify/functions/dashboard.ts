import functionHandler from "../lib/handler";

const handler = functionHandler({
    secure: true,
    handlers: {
        get: async (event, user) => {
            return {
                body: JSON.stringify({
                    dashboards: [],
                }),
            };
        },
    },
});

export { handler };

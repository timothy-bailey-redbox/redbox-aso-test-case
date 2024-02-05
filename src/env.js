import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),

        NETLIFY_AUTH_TOKEN: z.string().optional(),

        UI_DB_HOST: z.string(),
        UI_DB_USERNAME: z.string(),
        UI_DB_PASSWORD: z.string(),
        UI_DB_NAME: z.string(),
        UI_DB_PORT: z.string(),

        FIVETRAN_DB_HOST: z.string(),
        FIVETRAN_DB_USERNAME: z.string(),
        FIVETRAN_DB_PASSWORD: z.string(),
        FIVETRAN_DB_NAME: z.string(),
        FIVETRAN_DB_PORT: z.string(),

        APPTWEAK_DB_HOST: z.string(),
        APPTWEAK_DB_USERNAME: z.string(),
        APPTWEAK_DB_PASSWORD: z.string(),
        APPTWEAK_DB_NAME: z.string(),
        APPTWEAK_DB_PORT: z.string(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        // NEXT_PUBLIC_CLIENTVAR: z.string(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,

        NETLIFY_AUTH_TOKEN: process.env.NETLIFY_AUTH_TOKEN,

        UI_DB_HOST: process.env.UI_DB_HOST,
        UI_DB_USERNAME: process.env.UI_DB_USERNAME,
        UI_DB_PASSWORD: process.env.UI_DB_PASSWORD,
        UI_DB_NAME: process.env.UI_DB_NAME,
        UI_DB_PORT: process.env.UI_DB_PORT,

        FIVETRAN_DB_HOST: process.env.FIVETRAN_DB_HOST,
        FIVETRAN_DB_USERNAME: process.env.FIVETRAN_DB_USERNAME,
        FIVETRAN_DB_PASSWORD: process.env.FIVETRAN_DB_PASSWORD,
        FIVETRAN_DB_NAME: process.env.FIVETRAN_DB_NAME,
        FIVETRAN_DB_PORT: process.env.FIVETRAN_DB_PORT,

        APPTWEAK_DB_HOST: process.env.APPTWEAK_DB_HOST,
        APPTWEAK_DB_USERNAME: process.env.APPTWEAK_DB_USERNAME,
        APPTWEAK_DB_PASSWORD: process.env.APPTWEAK_DB_PASSWORD,
        APPTWEAK_DB_NAME: process.env.APPTWEAK_DB_NAME,
        APPTWEAK_DB_PORT: process.env.APPTWEAK_DB_PORT,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});

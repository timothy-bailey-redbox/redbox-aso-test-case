import { type Context } from "@netlify/functions";

export type UserAuth = {
    app_metadata: {
        provider: "google" | "email";
    };
    email: string;
    exp: number;
    sub: string;
    user_metadata: Record<string, unknown>;
};

export function getUser(context: Context): UserAuth | null {
    const token = context.cookies.get("nf_jwt");
    return !!token ? parseJwt(token) : null;
}

export function isLoggedIn(context: Context): boolean {
    return !!getUser(context)?.sub;
}

function parseJwt(token: string): UserAuth {
    return JSON.parse(Buffer.from(token?.split(".")?.[1] ?? "{}", "base64").toString()) as UserAuth;
}

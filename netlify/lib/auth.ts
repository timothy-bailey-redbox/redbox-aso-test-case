import { type HandlerContext } from "@netlify/functions";

export function isLoggedIn(context: HandlerContext): boolean {
    return !!getUser(context)?.sub;
}

export function getUser(context: HandlerContext): UserAuth {
    return (context.clientContext?.user as UserAuth) ?? null;
}

export type UserAuth = {
    app_metadata: {
        provider: "google" | "email";
    };
    email: string;
    exp: number;
    sub: string;
    user_metadata: Record<string, unknown>;
};

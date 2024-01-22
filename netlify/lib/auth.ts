import { type Context } from "@netlify/functions";
import { USER_ADMIN_ROLE } from "types/generic";

export type UserAuth = {
    app_metadata: {
        provider: "google" | "email";
        roles: string[];
    };
    email: string;
    exp: number;
    sub: string;
    user_metadata: Record<string, unknown>;
};

export function getUser(request: Request, context: Context): UserAuth | null {
    let token = context.cookies.get("nf_jwt");
    if (!token && request.headers.has("Authorization")) {
        token = request.headers.get("Authorization")?.replace("Bearer ", "") ?? "";
    }
    return !!token ? parseJwt(token) : null;
}

export function isLoggedIn(request: Request, context: Context): boolean {
    return !!getUser(request, context)?.sub;
}

function parseJwt(token: string): UserAuth {
    return JSON.parse(Buffer.from(token?.split(".")?.[1] ?? "{}", "base64").toString()) as UserAuth;
}

export function isAdmin(user: UserAuth) {
    return user.app_metadata?.roles?.includes(USER_ADMIN_ROLE);
}

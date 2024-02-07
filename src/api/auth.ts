import { type NextApiRequest } from "next";
import { USER_ADMIN_ROLE } from "types/generic";
import { HTTPResponseError } from "./handler";

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

export function getUser(request: NextApiRequest): UserAuth | null {
    let token = request.cookies.nf_jwt;
    if (!token && !!request.headers.authorization) {
        token = request.headers.authorization.replace("Bearer ", "") ?? "";
    }
    return !!token ? parseJwt(token) : null;
}

export function isLoggedIn(request: NextApiRequest): boolean {
    return !!getUser(request)?.sub;
}

function parseJwt(token: string): UserAuth {
    return JSON.parse(Buffer.from(token?.split(".")?.[1] ?? "{}", "base64").toString()) as UserAuth;
}

export function isAdmin(user: UserAuth) {
    return user.app_metadata?.roles?.includes(USER_ADMIN_ROLE);
}

export function assertIsAdmin(user: UserAuth) {
    if (!user.sub) {
        throw new HTTPResponseError(401, "User not logged in");
    }
    if (!isAdmin(user)) {
        throw new HTTPResponseError(403, "Higher user access level required");
    }
}

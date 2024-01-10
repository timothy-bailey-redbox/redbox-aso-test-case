import netlifyIdentity, { type User } from "netlify-identity-widget";
import { create } from "zustand";

declare global {
    interface Window {
        netlifyIdentity: typeof netlifyIdentity;
    }
}
window.netlifyIdentity = netlifyIdentity;

type UserState = {
    currentUser: User | null;
    isLoggedIn: boolean;
    isAdmin: boolean;
    error: Error | null;

    openLoginModal: () => void;
    closeLoginModal: () => void;
    logout: () => Promise<void>;

    getBearer: () => Promise<string>;
};

const useUserStore = create<UserState>()((set, get) => {
    netlifyIdentity.on("init", (user) => {
        console.info("Identity init", user);
        set({
            currentUser: user,
            isLoggedIn: true,
            isAdmin: user?.role === "admin",
        });
        netlifyIdentity.close();
    });

    netlifyIdentity.on("login", (user) => {
        console.info("Identity login", user);
        set({
            currentUser: user,
            isLoggedIn: true,
            isAdmin: user?.role === "admin",
        });
        netlifyIdentity.close();
    });

    netlifyIdentity.on("logout", () => {
        console.info("Identity  logged out");
        set({
            currentUser: null,
            isLoggedIn: false,
            isAdmin: false,
        });
        // router.push("/");
    });

    netlifyIdentity.on("error", (err) => {
        console.error("Identity error", err);
        set({
            error: err,
        });
    });

    async function getBearer() {
        const currentUser = get().currentUser;
        let token = currentUser?.token?.access_token;
        if (currentUser?.token?.expires_at ?? 0 < Date.now() + 10_000) {
            token = await netlifyIdentity.refresh();
            set({
                currentUser: netlifyIdentity.currentUser(),
            });
        }
        return `Bearer ${token}`;
    }

    netlifyIdentity.init({
        container: "#identity",
        locale: "en",
    });

    return {
        currentUser: null,
        isLoggedIn: false,
        isAdmin: false,
        error: null,

        openLoginModal: () => netlifyIdentity.open(),
        closeLoginModal: () => netlifyIdentity.close(),
        logout: async () => await netlifyIdentity.logout(),

        getBearer,
    };
});

export default useUserStore;

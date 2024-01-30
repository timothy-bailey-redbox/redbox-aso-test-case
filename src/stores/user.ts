import netlifyIdentity, { type User } from "netlify-identity-widget";
import { USER_ADMIN_ROLE } from "types/generic";
import { create } from "zustand";
import { isClientSide } from "~/lib/context";

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
    async function getBearer() {
        const currentUser = get().currentUser;
        let token = currentUser?.token?.access_token;
        if (currentUser?.token?.expires_at ?? 0 < Date.now() + 10_000) {
            token = await netlifyIdentity.refresh();
            const user = netlifyIdentity.currentUser();
            set({
                currentUser: user,
                isLoggedIn: true,
                isAdmin: user?.app_metadata?.roles?.includes(USER_ADMIN_ROLE),
            });
        }
        return token!;
    }

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

netlifyIdentity.on("init", (user) => {
    console.info("Identity init", user);
    if (user) {
        useUserStore.setState({
            currentUser: user,
            isLoggedIn: true,
            isAdmin: user?.app_metadata?.roles?.includes(USER_ADMIN_ROLE),
        });
    }
});

netlifyIdentity.on("login", (user) => {
    console.info("Identity login", user);
    useUserStore.setState({
        currentUser: user,
        isLoggedIn: true,
        isAdmin: user?.app_metadata?.roles?.includes(USER_ADMIN_ROLE),
    });
    netlifyIdentity.close();
});

netlifyIdentity.on("logout", () => {
    console.info("Identity  logged out");
    useUserStore.setState({
        currentUser: null,
        isLoggedIn: false,
        isAdmin: false,
    });
});

netlifyIdentity.on("error", (error) => {
    console.error("Identity error", error);
    useUserStore.setState({
        error,
    });
});

if (isClientSide()) {
    netlifyIdentity.init({
        container: "#identity",
        locale: "en",
    });
}

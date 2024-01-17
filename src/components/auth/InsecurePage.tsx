import { useRouter } from "next/router";
import useUserStore from "~/stores/user";
import LoadingScreen from "../basic/LoadingScreen";
import { LOGIN_REDIRECT_STORAGE_KEY } from "./consts";

type InsecurePageProps = React.PropsWithChildren;

export default function InsecurePage({ children }: InsecurePageProps) {
    const user = useUserStore();
    const router = useRouter();

    if (user.isLoggedIn) {
        const redirect = sessionStorage.getItem(LOGIN_REDIRECT_STORAGE_KEY);
        void router.push(redirect ?? "/dashboards");
        sessionStorage.removeItem(LOGIN_REDIRECT_STORAGE_KEY);
        return <LoadingScreen label={"Redirecting…"} />;
    }

    return children;
}

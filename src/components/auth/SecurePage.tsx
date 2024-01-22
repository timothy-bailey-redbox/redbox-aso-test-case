import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useUserStore from "~/stores/user";
import LoadingScreen from "../basic/LoadingScreen";
import { LOGIN_REDIRECT_STORAGE_KEY } from "./consts";

type SecurePageProps = React.PropsWithChildren<{
    redirect?: string;
}>;

export default function SecurePage({ children, redirect }: SecurePageProps) {
    const user = useUserStore();
    const router = useRouter();

    // This is to disable SSR
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    if (!isClient) {
        return <LoadingScreen />;
    }

    if (!user.isLoggedIn) {
        void router.push(redirect ?? "/");
        sessionStorage.setItem(LOGIN_REDIRECT_STORAGE_KEY, location.href);
        return <LoadingScreen label={"Redirecting…"} />;
    }

    return children;
}

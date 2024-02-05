import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { minutes } from "~/lib/time";

import "~/styles/globals.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: minutes(10),
        },
    },
});

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Head>
                <title>ASO Dashboard - Redbox Mobile</title>
                <meta name="description" content="App Store Optimisation dashboards by Redbox Mobile" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3" />
                <link rel="icon" type="image/xml+svg" href="/favicon.svg?v=3" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=3" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=3" />
                <link rel="manifest" href="/site.webmanifest?v=3" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg?v=3" color="#8200ff" />
                <meta name="msapplication-TileColor" content="#251041" />
                <meta name="theme-color" content="#251041" />
                <meta name="apple-mobile-web-app-title" content="ASO Dashboard - Redbox Mobile" />
                <meta name="application-name" content="ASO Dashboard - Redbox Mobile" />
            </Head>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;

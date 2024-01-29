import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";

import "~/styles/globals.css";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            staleTime: 10 * 60 * 1000, // 10 Mins
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
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;

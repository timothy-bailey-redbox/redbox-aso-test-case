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
            </Head>
            <Component {...pageProps} />
        </QueryClientProvider>
    );
};

export default MyApp;

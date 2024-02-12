import { type AppType } from "next/dist/shared/lib/utils";
import Head from "next/head";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>ASO Dashboard - Redbox Mobile</title>
                <meta name="description" content="App Store Optimisation dashboards by Redbox Mobile" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <Component {...pageProps} />
        </>
    );
};

export default MyApp;

import "styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider } from "context";
import { Layout, LoginGuard, SetSubjectTestsModal } from "components";
import { useEffect } from "react";
import Head from "next/head";

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document?.activeElement?.matches("[type='number']")) {
        (event.target as HTMLInputElement).blur();
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>Exam Manager</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="favicon.svg" />
      </Head>
      <ContextProvider>
        <LoginGuard router={router} />
        <Layout>
          <Component {...{ ...pageProps, router }} />
        </Layout>
        <SetSubjectTestsModal />
      </ContextProvider>
    </>
  );
}

export default MyApp;

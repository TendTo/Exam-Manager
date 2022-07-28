import "styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider } from "context";
import { Layout, LoginGuard, SetSubjectTestsModal } from "components";
import { useEffect } from "react";

function MyApp({ Component, pageProps, router }: AppProps) {
  useEffect(() => {
    document.addEventListener("wheel", function (event) {
      if (document?.activeElement?.matches("[type='number']")) {
        (event.target as HTMLInputElement).blur();
      }
    });
  }, []);

  return (
    <ContextProvider>
      <LoginGuard router={router} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <SetSubjectTestsModal />
    </ContextProvider>
  );
}

export default MyApp;

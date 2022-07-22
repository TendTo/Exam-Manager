import "styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider } from "context";
import { Layout, LoginGuard, SetSubjectTestsModal } from "components";

function MyApp({ Component, pageProps, router }: AppProps) {
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

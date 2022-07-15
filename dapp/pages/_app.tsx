import "styles/globals.css";
import type { AppProps } from "next/app";
import { ContextProvider } from "context";
import { Layout } from "components";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ContextProvider>
  );
}

export default MyApp;

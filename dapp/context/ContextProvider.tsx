import { ThemeContextProvider } from "./themeContext";
import { ChainId, Config, DAppProvider, Ropsten } from "@usedapp/core";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const config: Config = {
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/a98b74ca6632423a815f4eab3a144dae`,
  },
  networks: [Ropsten],
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {
  return (
    <ThemeContextProvider>
      <DAppProvider config={config}>
        {children}
        <ToastContainer />
      </DAppProvider>
    </ThemeContextProvider>
  );
}

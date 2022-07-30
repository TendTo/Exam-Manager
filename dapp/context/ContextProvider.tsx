import { ChainId, Config, DAppProvider, Goerli } from "@usedapp/core";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SubjectIdContextProvider } from "./subjectIdContext";
import { UserContextProvider } from "./userContext";

const config: Config = {
  readOnlyUrls: {
    [ChainId.Goerli]: `https://goerli.infura.io/v3/a98b74ca6632423a815f4eab3a144dae`,
  },
  networks: [Goerli],
};

type ContextProviderProps = {
  children: React.ReactNode;
};

export function ContextProvider({ children }: ContextProviderProps) {
  return (
    <DAppProvider config={config}>
      <SubjectIdContextProvider>
        <UserContextProvider>{children}</UserContextProvider>
      </SubjectIdContextProvider>
      <ToastContainer />
    </DAppProvider>
  );
}

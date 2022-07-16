import { Localhost, useCall, useEtherBalance, useEthers, useLogs } from "@usedapp/core";
import { useThemeContext } from "context";
import type { NextPage } from "next";
import Link from "next/link";
import { ExamContract__factory, ExamContract } from "types";
import config from "config/contracts.json";
import { useTestPassedLogs } from "hooks/useTestPassedLogs";

const Home: NextPage = () => {
  const { account, activateBrowserWallet, library } = useEthers();
  const balance = useEtherBalance(account, { chainId: Localhost.chainId });
  const contract = library ? ExamContract__factory.connect(config.examContractAddress, library) : undefined;
  const { state } = useThemeContext();

  const { value, error  } = useTestPassedLogs();
  //console.log(value, error)
  return (
    <div>
      <div>L'admin è {value}</div>
      <div>Il contratto è deployato all'indirizzo {contract?.address}</div>
      <div>Account: {account ?? "no account"}</div>
      <div>Balance: {balance ? balance.toString() : "No banane"}</div>
      <button onClick={activateBrowserWallet}>Login</button>
      <br />
      <div>{state}</div>
      <Link href='/students'>
        <a>Go student</a>
      </Link>
    </div>
  );
};

export default Home;

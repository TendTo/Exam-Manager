import { useEtherBalance, useEthers, useLogs } from "@usedapp/core";
import { useThemeContext } from "context";
import type { NextPage } from "next";
import Link from "next/link";
import { ExamContract__factory, ExamContract } from "types";

const Home: NextPage = () => {
  const { account, activateBrowserWallet, library } = useEthers();
  const balance = useEtherBalance(account);
  const contract = library ? ExamContract__factory.connect("indirizzo sulla blockchain", library) : undefined;
  const logs = useLogs(contract ? {contract, event: "TestPassed", args: []}: undefined);
  const { state } = useThemeContext();

  return (
    <div>
      <div>{balance ? balance.toString() : "No banane"}</div>
      <button onClick={activateBrowserWallet}>Login</button>
      <br />
      <dig>{logs?.value.}</dig>
      <div>{state}</div>
      <Link href='/students'>
        <a>Go student</a>
      </Link>
    </div>
  );
};

export default Home;

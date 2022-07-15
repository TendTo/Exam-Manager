import { useEtherBalance, useEthers } from "@usedapp/core";
import { useThemeContext } from "context";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const { account, activateBrowserWallet } = useEthers();
  const balance = useEtherBalance(account);
  const { state } = useThemeContext();

  return (
    <div>
      <div>{balance ? balance.toString() : "No banane"}</div>
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

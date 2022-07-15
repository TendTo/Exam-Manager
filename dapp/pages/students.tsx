import { useEtherBalance, useEthers } from "@usedapp/core";
import { useThemeContext } from "context";
import type { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  const { account, activateBrowserWallet } = useEthers();
  const balance = useEtherBalance(account);
  const { state, update } = useThemeContext();
  return (
    <div>
      <h2>Studente</h2>
      <div>{balance ? balance.toString() : "No banane"}</div>
      <button onClick={activateBrowserWallet}>Login</button>
      <br />
      <button className="btn" onClick={() => update()}>Change theme</button>
      <div>{state}</div>
      <br />
      <br />
      <Link href='/'>
        <a>Go home</a>
      </Link>
    </div>
  );
};

export default Home;

import { useEtherBalance, useEthers } from "@usedapp/core";
import { useThemeContext } from "context";
import type { NextPage } from "next";
import Link from "next/link";
import { utils } from "ethers";
import { useAdmin, useGetSubjectTests, useGetTestMark } from "hooks";

const Home: NextPage = () => {
  const { account, activateBrowserWallet, library } = useEthers();
  const balance = useEtherBalance(account);
  const { state } = useThemeContext();
  const { value } = useAdmin(library);
  const { value: tests } = useGetSubjectTests(library, 72440);
  const { value: testResult } = useGetTestMark(library, 72440, 0, 1010);
  console.log("tests", tests);
  console.log("testResult", testResult);
  return (
    <div>
      <div>L'admin è {value}</div>
      <div>Account: {account ?? "no account"}</div>
      <div>Balance: {balance ? `${utils.formatEther(balance)} ETH` : "No banane"}</div>
      <button onClick={activateBrowserWallet}>Login</button>
      <br />
      <div>{state}</div>
      <Link href="/students">
        <a>Go student</a>
      </Link>
    </div>
  );
};

export default Home;

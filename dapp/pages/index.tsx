import { useEthers } from "@usedapp/core";
import { LogoMetamask } from "components";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAdmin } from "hooks";

export default function Home() {
  const { activateBrowserWallet, account, library } = useEthers();
  const { value: admin } = useAdmin(library);
  const router = useRouter();
  
  useEffect(() => {
    if (account === undefined || admin === undefined) return;
    if (account === admin[0]) {
      router.push({
        pathname: "/admin",
      });
    } else {
      router.push({
        pathname: "/students",
      });
    }
  }, [account, admin]);

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Exam Manager</h1>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <button className="btn btn-primary" onClick={activateBrowserWallet}>
            Login con <LogoMetamask />
          </button>
        </div>
      </div>
    </div>
  );
}

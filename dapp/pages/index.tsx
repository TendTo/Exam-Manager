import { useEthers } from "@usedapp/core";
import { LogoMetamask } from "components";
import { useUserIdContext } from "context";
import { NextRouter } from "next/router";
import { useCallback } from "react";

type IndexProps = {
  router: NextRouter;
};

export default function Home({ router }: IndexProps) {
  const { activateBrowserWallet } = useEthers();
  const { state: user, update } = useUserIdContext();

  const handleClick = useCallback(() => {
    activateBrowserWallet();
    switch (user) {
      case "notLogged":
        router.push("/");
        break;
      case "admin":
        router.replace("/admin");
        break;
      case "student":
        router.replace("/students");
        break;
      case "professor":
        router.replace("/professor");
        break;
      case "unknown":
        router.replace("/404");
      default:
        break;
    }
  }, [user, router]);

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Exam Manager</h1>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <button className="btn btn-primary" onClick={handleClick}>
            Login con <LogoMetamask />
          </button>
        </div>
      </div>
    </div>
  );
}

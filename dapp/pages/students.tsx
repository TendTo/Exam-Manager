import { useEthers } from "@usedapp/core";

export default function Students() {
  const { activateBrowserWallet } = useEthers();

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Studente</h1>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <button className="btn btn-primary">
          </button>
        </div>
      </div>
    </div>
  );
}

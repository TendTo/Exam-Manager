import { useEthers } from "@usedapp/core";
import { ContractFunction } from "components";
import { useAddStudent, useAddSubject } from "hooks";

export default function Admin() {

  const { library } = useEthers();

  const { send: addStudent } = useAddStudent(library);
  const { send: addSubject } = useAddSubject(library);

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold">Admin</h1>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Function</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ContractFunction
                      title="Titolo"
                      description="CIAO MAMMA IL FRONTEND FA SCHIFO"
                      fields={[
                        {
                          label: "Indirizzo",
                          type: "address",
                        },
                        {
                          label: "Matricola",
                          type: "number",
                        },
                      ]}
                      callback={addStudent}
                    />
                  </td>
                </tr>
                <tr>
                  <th>2</th>
                </tr>
                <tr>
                  <th>3</th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

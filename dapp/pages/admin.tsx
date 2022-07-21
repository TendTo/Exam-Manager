import { useEthers } from "@usedapp/core";
import { ContractFunction } from "components";
import { useAdminFunctions } from "hooks";

export default function Admin() {
  const { library } = useEthers();

  const { addStudent, deleteStudent, addSubject, addAuthorizedProf, removeAuthorizedProf } =
    useAdminFunctions(library);

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
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Funzioni disponibili</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <ContractFunction
                      title="Aggiungi uno studente"
                      description="Assegna un indirizzo ad una determinata matricola"
                      fields={[
                        {
                          label: "Indirizzo pubblico dello studente",
                          name: "addr",
                          type: "address",
                        },
                        {
                          label: "Matricola",
                          name: "studentId",
                          type: "uint256",
                        },
                      ]}
                      callback={addStudent}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Rimuovi uno studente"
                      description="Rimuovi la matricola associata ad un determinato indirizzo"
                      fields={[
                        {
                          label: "Indirizzo pubblico dello studente",
                          name: "addr",
                          type: "address",
                        },
                      ]}
                      callback={deleteStudent}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Aggiungi una materia"
                      description="Aggiungi una materia specificando il nuovo id, il nome, i CFU, il numero di propedeuticità e la lista di materie che hanno la seguente materia necessaria"
                      fields={[
                        {
                          label: "Id materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                        {
                          label: "Nome materia",
                          name: "name",
                          type: "string",
                        },
                        {
                          label: "CFU",
                          name: "cfu",
                          type: "uint8",
                        },
                        {
                          label: "Numero di propedeuticità",
                          name: "requiredCount",
                          type: "uint8",
                        },
                        {
                          label: "Lista di materie necessarie",
                          name: "subjectIdToUnlock",
                          type: "array",
                          subFields: [
                            {
                              label: "Id materia",
                              name: "subjectId",
                              type: "uint256",
                            },
                          ],
                        },
                      ]}
                      callback={addSubject}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Aggiungi autorizzazione ad un professore"
                      description="Aggiungi l'indirizzo pubblico di un professore ad una determinata materia"
                      fields={[
                        {
                          label: "Id materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                        {
                          label: "Indirizzo pubblico del professore",
                          name: "addr",
                          type: "address",
                        },
                      ]}
                      callback={addAuthorizedProf}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Rimuovi autorizzazione ad un professore"
                      description="Rimuovi l'indirizzo pubblico di un professore da una determinata materia"
                      fields={[
                        {
                          label: "Id materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                        {
                          label: "Indirizzo pubblico del professore",
                          name: "addr",
                          type: "address",
                        },
                      ]}
                      callback={removeAuthorizedProf}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

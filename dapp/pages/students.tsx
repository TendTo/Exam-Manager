import { useEthers } from "@usedapp/core";
import { ContractFunction } from "components";
import { useStudentCalls, useStudentFunctions } from "hooks";

export default function Students() {
  const { library, account } = useEthers();
  const { acceptSubjectResult, rejectTestResult, resetSubject } = useStudentFunctions();
  const { studentId, subjectAccepted, subjectPassed, subjectResetted, testFailed, testPassed } =
    useStudentCalls(library, account);

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold">{studentId}</h1>
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
                      title="Rifiuta il voto di un esame"
                      description="Rifiuta il voto di un esame. Potresti dover ripetere alcuni esami precedenti"
                      fields={[
                        {
                          label: "Id della materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                        {
                          label: "Id dell'esame",
                          name: "testId",
                          type: "uint8",
                        },
                      ]}
                      callback={console.log}
                      // callback={rejectTestResult}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Accetta il voto di una materia"
                      description="Accetta il voto di una materia. Il voto verrà registrato nella tua carriera universitaria"
                      fields={[
                        {
                          label: "Id della materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                      ]}
                      callback={console.log}
                      // callback={acceptSubjectResult}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Ripristina una materia"
                      description="Ripristina una materia allo stato originale. Tutti i risultati attuali degli esami della materia verranno cancellati"
                      fields={[
                        {
                          label: "Id della materia",
                          name: "subjectId",
                          type: "uint256",
                        },
                      ]}
                      // callback={resetSubject}
                      callback={console.log}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Registra i voti di un esame"
                      description="Registra i voti di un esame ad una lista di studenti"
                      fields={[
                        {
                          label: "Risultati esami",
                          name: "subjectId",
                          type: "object",
                          subFields: [
                            {
                              label: "Matricola",
                              name: "studentId",
                              type: "uint256",
                            },
                            {
                              label: "Voto",
                              name: "mark",
                              type: "uint8",
                            },
                          ],
                        },
                      ]}
                      callback={console.log}
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <ContractFunction
                      title="Registra i voti di un esame"
                      description="Registra i voti di un esame ad una lista di studenti"
                      fields={[
                        {
                          label: "Risultati esami",
                          name: "subjectId",
                          type: "array",
                          subFields: [
                            {
                              label: "Matricola",
                              name: "studentId",
                              type: "uint256",
                            },
                            {
                              label: "Voto",
                              name: "mark",
                              type: "uint8",
                            },
                          ],
                        },
                      ]}
                      callback={console.log}
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

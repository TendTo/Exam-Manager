import { useEthers } from "@usedapp/core";
import { ActiveSubject } from "components";
import { useProfessorCalls, useProfessorFunctions } from "hooks";
import { UseLogsReturn } from "hooks/logs";
import { useMemo } from "react";
import { ExamContract } from "types";

function getTeachedSubjects(
  added: UseLogsReturn<ExamContract, "AuthorizedProfAdded">["value"] = [],
  removed: UseLogsReturn<ExamContract, "AuthorizedProfRemoved">["value"] = []
) {
  const allTests = [
    ...added.map((test) => ({ ...test, active: true })),
    ...removed.map((test) => ({ ...test, active: false })),
  ];
  const sortedTests = allTests.sort((a, b) => a.blockNumber - b.blockNumber);

  const subjectObject = sortedTests.reduce((acc, subject) => {
    acc[subject.data.subjectId] = {
      active: subject.active,
    };
    return acc;
  }, {} as Record<string, { active: boolean }>);

  return Object.entries(subjectObject).reduce(
    (acc, [subjectId, tests]) => {
      if (tests.active) acc.active.push(subjectId as unknown as number);
      else acc.notActive.push(subjectId as unknown as number);
      return acc;
    },
    { active: [], notActive: [] } as { active: number[]; notActive: number[] }
  );
}

export default function Professor() {
  const { library, account } = useEthers();
  const { registerSubjectREsult, registerTestResult, setSubjectTests } =
    useProfessorFunctions(library);
  const { authorizedProfAdded, authorizedProfRemoved } = useProfessorCalls(library, account);

  const { active } = useMemo(
    () => getTeachedSubjects(authorizedProfAdded, authorizedProfRemoved),
    [authorizedProfAdded, authorizedProfRemoved]
  );

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Professor</h1>
          <p className="text-xl" title={account}>
            {account}
          </p>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <div>Materie attive</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {active.map((subjectId) => (
                  <ActiveSubject
                    key={subjectId}
                    subjectId={subjectId}
                    library={library}
                    setSubjectTests={setSubjectTests}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

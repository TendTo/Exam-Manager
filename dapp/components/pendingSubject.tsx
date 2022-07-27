import { useGetSubjectTests, useStudentFunctions, useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import { TestResult } from "pages/students";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  mark?: number;
  subjectId: string;
  tests?: TestResult;
};

export default function PendingSubject({ library, mark, subjectId, tests }: PendingSubjectProps) {
  const { value: subjectInfo } = useSubjects(library, parseInt(subjectId));
  const { acceptSubjectResult, resetSubject, rejectTestResult } = useStudentFunctions(library);
  const { value: testList } = useGetSubjectTests(library, parseInt(subjectId));

  if (!subjectInfo) return <></>;
  return (
    <tr>
      <td>
        <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-xl font-bold flex flex-row justify-between">
            <div>{subjectInfo.name}</div>
            <div>CFU: {subjectInfo.cfu}</div>
            {mark && (
              <>
                <div>{mark}</div>
                <div>
                  <button
                    className="btn btn-success mr-1"
                    onClick={() => acceptSubjectResult(subjectId)}
                  >
                    ✔️
                  </button>
                  <button className="btn btn-error" onClick={() => resetSubject(subjectId)}>
                    ❌
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="collapse-content">
            {tests && (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Risultato</th>
                    <th>Azioni</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tests).map(([testId, test]) => (
                    <tr key={`${subjectId}-${testId}`}>
                      <td>{testList ? testList[parseInt(testId)].name : testId}</td>
                      <td className={test.passed ? "text-green-500" : "text-red-500"}>
                        {test.mark}
                      </td>
                      <td>
                        {test.canRefuse ? (
                          <button
                            className="btn btn-error"
                            onClick={() => rejectTestResult(subjectId, testId)}
                          >
                            ❌
                          </button>
                        ) : undefined}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

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
        <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row overflow-visible">
          <input type="checkbox" className="peer mb-0" />
          <div className="collapse-title text-xl font-bold flex flex-row justify-between">
            {mark && (
              <span className="indicator-item badge badge-secondary absolute -top-2 -right-2"></span>
            )}
            <div>{subjectInfo.name}</div>
            <div>CFU: {subjectInfo.cfu}</div>
          </div>
          <div className="collapse-content">
            {mark && (
              <>
              <div className="divider mt-1"/>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-row gap-3">
                    <div className="font-bold">Proposta di voto</div>
                    <div>{mark}</div>
                  </div>
                  <div>
                    <button
                      className="btn btn-success btn-sm mr-1"
                      onClick={() => acceptSubjectResult(subjectId)}
                    >
                      ✔️
                    </button>
                    <button
                      className="btn btn-error btn-sm"
                      onClick={() => resetSubject(subjectId)}
                    >
                      ❌
                    </button>
                  </div>
                </div>
                <div className="divider" />
              </>
            )}
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

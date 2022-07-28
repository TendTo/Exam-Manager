import { useGetSubjectTests, useStudentFunctions, useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";

type AcceptedSubjectProps = {
  library: JsonRpcProvider | undefined;
  mark?: number;
  subjectId: string;
  tests?: Record<string, { mark: number; passed: boolean }>;
};

export default function AcceptedSubject({ library, mark, subjectId, tests }: AcceptedSubjectProps) {
  const { value: subjectInfo } = useSubjects(library, parseInt(subjectId));
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
            {mark && <div>Voto: {mark}</div>}
          </div>
          <div className="collapse-content">
            {tests && (
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Test</th>
                    <th>Risultato</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(tests).map(([testId, test]) => (
                    <tr key={`${subjectId}-${testId}`}>
                      <td>{testList ? testList[parseInt(testId)].name : testId}</td>
                      <td className={test.passed ? "text-green-500" : "text-red-500"}>
                        {test.mark}
                      </td>
                      <td />
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

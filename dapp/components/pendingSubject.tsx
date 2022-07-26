import { useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  mark?: number;
  subjectId: string;
  tests?: Record<string, { mark: number; passed: boolean }>;
};

export default function PendingSubject({ library, mark, subjectId, tests }: PendingSubjectProps) {
  const { value: subjectInfo } = useSubjects(library, parseInt(subjectId));
  console.log(subjectInfo);
  if (!subjectInfo) return <></>;
  return (
    <tr>
      <td>
        <div>{subjectInfo.name}</div>
        <div>CFU: {subjectInfo.cfu}</div>
        <div>{mark}</div>
        {tests &&
          Object.entries(tests).map(([testId, test]) => (
            <div key={testId}>
              TestId: {testId}
              <br />
              {test.passed ? "✅" : "❌"}
              <br />
              Voto {test.mark}
            </div>
          ))}
      </td>
    </tr>
  );
}

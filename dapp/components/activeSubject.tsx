import { useGetSubjectTests, useRegisterTestResults, useRegisterSubjectResults } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import SetSubjectTests from "./setSubjectTests";
import RegisterTestVotes from "./registerTestVotes";
import RegisterSubjectVotes from "./registerSubjectVotes";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  subjectId: number;
};

export default function ActiveSubject({ library, subjectId }: PendingSubjectProps) {
  const { value: subjectTests } = useGetSubjectTests(library, subjectId);
  const { send: sendTest } = useRegisterTestResults(library);
  const { send: sendSubject } = useRegisterSubjectResults(library);

  return (
    <tr>
      <td>
        <div className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row">
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-xl font-bold">Materia: {subjectId}</div>
          <div className="collapse-content">
            <div className="border-2 rounded-md border-accent p-3">
              <div className="flex flex-row justify-between items-center mb-5">
                <p className="font-bold text-xl ml-5">Test</p>
                <SetSubjectTests subjectId={subjectId} />
              </div>
              <div>
                {subjectTests &&
                  subjectTests.map((test, idx) => (
                    <RegisterTestVotes
                      key={idx}
                      testName={test.name}
                      minMark={test.minMark}
                      callback={(results) => sendTest(subjectId, idx, results)}
                    />
                  ))}
              </div>
            </div>
            <div className="divider" />
            <RegisterSubjectVotes callback={(results) => sendSubject(subjectId, results)} />
          </div>
        </div>
      </td>
    </tr>
  );
}

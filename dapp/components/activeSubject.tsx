import { useGetSubjectTests, useRegisterTestResults } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import SetSubjectTests from "./setSubjectTests";
import { IExamContract } from "types";
import RegisterTestVotes from "./registerTestVotes";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  subjectId: number;
  setSubjectTests: (subjectId: number, tests: IExamContract.TestStruct[]) => Promise<any>;
};

export default function ActiveSubject({ library, subjectId }: PendingSubjectProps) {
  const { value: subjectTests } = useGetSubjectTests(library, subjectId);
  const { send } = useRegisterTestResults(library);

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
                      testName={test.name}
                      minMark={test.minMark}
                      callback={(results) => send(subjectId, idx, results)}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

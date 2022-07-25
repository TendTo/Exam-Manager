import { useGetSubjectTests, useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import SetSubjectTests from "./setSubjectTests";
import { IExamContract } from "types";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  subjectId: number;
  setSubjectTests: (subjectId: number, tests: IExamContract.TestStruct[]) => Promise<any>;
};

export default function ActiveSubject({ library, subjectId }: PendingSubjectProps) {
  const { value: subjectTests } = useGetSubjectTests(library, subjectId);
  return (
    <tr>
      <td>
        <div
          tabIndex={0}
          className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box flex-row"
        >
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-xl font-bold">Materia: {subjectId}</div>
          <div className="collapse-content">
            <div className="flex flex-row justify-end">
              <SetSubjectTests library={library} subjectId={subjectId} />
            </div>
          </div>
          <div>{subjectTests && subjectTests.map((test) => <></>)}</div>
        </div>
      </td>
    </tr>
  );
}

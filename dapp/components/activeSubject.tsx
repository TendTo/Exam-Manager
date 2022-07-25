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
        <div className="flex">
          <div>Subject ID: {subjectId}</div>
          <SetSubjectTests subjectId={subjectId} library={library} />
        </div>
        {subjectTests &&
          subjectTests.map((test) => (
            <></>
            // <div>
            //   {test.name}
            //   <div>CFU: {test.cfu}</div>
            //   <div>Mark: {test.mark}</div>
            // </div>
          ))}
      </td>
    </tr>
  );
}

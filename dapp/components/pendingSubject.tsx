import { useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  mark: number;
  subjectId: number;
};

export default function PendingSubject({ library, mark, subjectId }: PendingSubjectProps) {
  const { value: subjectInfo } = useSubjects(library, subjectId);

  if (!subjectInfo) return <></>;
  return (
    <tr>
      <td>
        <div>{subjectInfo.name}</div>
        <div>CFU: {subjectInfo.cfu}</div>
        <div>{mark}</div>
      </td>
    </tr>
  );
}

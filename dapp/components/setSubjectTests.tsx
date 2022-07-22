import { useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useSubjectIdContext } from "context";

type PendingSubjectProps = {
  library: JsonRpcProvider | undefined;
  subjectId: number;
};

export default function SetSubjectTests({ library, subjectId }: PendingSubjectProps) {
  const { update } = useSubjectIdContext();
  return (
    <>
      <label htmlFor="set-subject-modal" className="btn modal-button" onClick={() => update(subjectId)}>
        open modal
      </label>
    </>
  );
}

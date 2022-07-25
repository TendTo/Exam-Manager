import { useSubjects } from "hooks";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useSubjectIdContext } from "context";

type PendingSubjectProps = {
  subjectId: number;
};

export default function SetSubjectTests({ subjectId }: PendingSubjectProps) {
  const { update } = useSubjectIdContext();
  return (
    <>
      <label
        htmlFor="set-subject-modal"
        className="btn btn-warning modal-button"
        onClick={() => update(subjectId)}
      >
        Modifica tests
      </label>
    </>
  );
}

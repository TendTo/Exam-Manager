import { useLogs } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { UseLogsReturn } from "./logs";

export function useSubjectResettedLogs(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  studentId: number | undefined
): UseLogsReturn<ExamContract, "SubjectResetted"> {
  return (
    useLogs(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        event: "SubjectResetted",
        args: [subjectId, studentId],
      }
    ) ?? ({ value: undefined, error: undefined } as any)
  );
}

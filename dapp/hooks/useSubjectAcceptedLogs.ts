import { useLogs } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { UseLogsReturn } from "./logs";

export function useSubjectAcceptedLogs(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  studentId: number | undefined
): UseLogsReturn<ExamContract, "SubjectAccepted"> {
  return (
    useLogs(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        event: "SubjectAccepted",
        args: [subjectId, studentId],
      }
    ) ?? ({ value: undefined, error: undefined } as any)
  );
}

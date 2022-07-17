import { useLogs } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { UseLogsReturn } from "./logs";

export function useTestFailedLogs(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  testIdx: number | undefined,
  studentId: number | undefined
): UseLogsReturn<ExamContract, "TestFailed"> {
  return (
    useLogs(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        event: "TestFailed",
        args: [studentId, testIdx, subjectId],
      }
    ) ?? ({ value: undefined, error: undefined } as any)
  );
}

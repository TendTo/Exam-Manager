import { useLogs } from "@usedapp/core";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { UseLogsReturn } from "./logs";

export function useAuthorizedProfAddedLogs(
  provider: JsonRpcProvider | undefined,
  profAddress: string | undefined
): UseLogsReturn<ExamContract, "AuthorizedProfAdded"> {
  return (
    useLogs(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        event: "AuthorizedProfAdded",
        args: [undefined, profAddress],
      }
    ) ?? ({ value: undefined, error: undefined } as any)
  );
}

import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract__factory } from "types";
import config from "config/contracts.json";

export function useIsProfAuthorized(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  profAddr: string | undefined
) {
  if (!provider || subjectId === undefined || profAddr === undefined)
    return { value: undefined, error: undefined };

  return (
    useCall({
      contract: ExamContract__factory.connect(config.examContractAddress, provider),
      method: "isProfAuthorized",
      args: [subjectId, profAddr],
    }) ?? { value: undefined, error: undefined }
  );
}

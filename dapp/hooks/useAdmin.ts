import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract__factory } from "types";
import config from "config/contracts.json";

export function useAdmin(provider: JsonRpcProvider | undefined) {
  return (
    useCall(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        method: "admin",
        args: [],
      }
    ) ?? { value: undefined, error: undefined }
  );
}

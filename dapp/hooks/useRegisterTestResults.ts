import { useContractFunction } from "./useContractFunction";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract__factory } from "types";
import config from "config/contracts.json";

export function useRegisterTestResults(provider: JsonRpcProvider | undefined) {
  return useContractFunction(
    provider && ExamContract__factory.connect(config.examContractAddress, provider),
    "registerTestResults"
  );
}

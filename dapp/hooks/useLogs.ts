import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract__factory } from "types";
import config from "config/contracts.json";
import { useAsync } from "./useAsync";
import { useCallback } from "react";
import { useEthers } from "@usedapp/core";

export function useLogs() {
  const { library } = useEthers();
  const callback = useCallback(async () => {
    if (!library) return;
    const contract = ExamContract__factory.connect(config.examContractAddress, library);
    return await contract.queryFilter("*" as any, undefined, undefined);
  }, [library]);

  return useAsync(callback, true, undefined);
}

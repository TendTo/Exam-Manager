import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { Call } from "@usedapp/core";

export function useStudentIds(provider: JsonRpcProvider | undefined, address: string | undefined) {
  const call: undefined | Call<ExamContract, "studentIds"> =
    !provider || address === undefined
      ? undefined
      : {
          contract: ExamContract__factory.connect(config.examContractAddress, provider),
          method: "studentIds",
          args: [address],
        };

  return useCall(call) ?? { value: undefined, error: undefined };
}

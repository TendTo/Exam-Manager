import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { Call } from "@usedapp/core";

export function useGetTestMark(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  testIdx: number | undefined,
  studentId: number | undefined
) {
  const call: undefined | Call<ExamContract, "getTestMark"> =
    !provider || subjectId === undefined || testIdx === undefined || studentId === undefined
      ? undefined
      : {
          contract: ExamContract__factory.connect(config.examContractAddress, provider),
          method: "getTestMark",
          args: [subjectId, testIdx, studentId],
        };

  return useCall(call) ?? { value: undefined, error: undefined };
}

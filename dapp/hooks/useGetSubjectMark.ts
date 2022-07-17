import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { Call } from "@usedapp/core";

export function useGetSubjectMark(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined,
  studentId: number | undefined
) {
  const call: undefined | Call<ExamContract, "getSubjectMark"> =
    !provider || subjectId === undefined || studentId === undefined
      ? undefined
      : {
          contract: ExamContract__factory.connect(config.examContractAddress, provider),
          method: "getSubjectMark",
          args: [subjectId, studentId],
        };

  return useCall(call) ?? { value: undefined, error: undefined };
}

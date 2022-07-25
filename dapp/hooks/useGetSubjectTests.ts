import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract, ExamContract__factory } from "types";
import config from "config/contracts.json";
import { Call } from "@usedapp/core";

export function useGetSubjectTests(
  provider: JsonRpcProvider | undefined,
  subjectId: number | undefined
) {
  const call: undefined | Call<ExamContract, "getSubjectTests"> =
    !provider || subjectId === undefined
      ? undefined
      : {
          contract: ExamContract__factory.connect(config.examContractAddress, provider),
          method: "getSubjectTests",
          args: [subjectId],
        };

  const { value, ...rest } = useCall(call) ?? { value: undefined, error: undefined };
  const extractedValue = Array.isArray(value) && value.length === 1 ? value[0] : undefined;
  return { value: extractedValue, ...rest };
}

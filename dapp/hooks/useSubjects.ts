import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { ExamContract__factory } from "types";
import config from "config/contracts.json";

export function useSubjects(provider: JsonRpcProvider | undefined, subjectId: number) {
  return (
    useCall(
      provider && {
        contract: ExamContract__factory.connect(config.examContractAddress, provider),
        method: "subjects",
        args: [subjectId],
      }
    ) ?? { value: undefined, error: undefined }
  );
}

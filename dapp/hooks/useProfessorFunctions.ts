import { JsonRpcProvider } from "@ethersproject/providers";
import { useRegisterSubjectResults } from "./useRegisterSubjectResults";
import { useRegisterTestResults } from "./useRegisterTestResults";
import { useSetSubjectTests } from "./useSetSubjectTests";

export function useProfessorFunctions(library: JsonRpcProvider | undefined) {
  const { send: registerTestResult } = useRegisterTestResults(library);
  const { send: registerSubjectREsult } = useRegisterSubjectResults(library);
  const { send: setSubjectTests } = useSetSubjectTests(library);
  return { registerTestResult, registerSubjectREsult, setSubjectTests };
}

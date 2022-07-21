import { JsonRpcProvider } from "@ethersproject/providers";
import { useAcceptSubjectResult } from "./useAcceptSubjectResult";
import { useRejectTestResult } from "./useRejectTestResult";
import { useResetSubject } from "./useResetSubject";

export function useStudentFunctions(library: JsonRpcProvider | undefined) {
  const { send: acceptSubjectResult } = useAcceptSubjectResult(library);
  const { send: rejectTestResult } = useRejectTestResult(library);
  const { send: resetSubject } = useResetSubject(library);
  return { acceptSubjectResult, rejectTestResult, resetSubject };
}

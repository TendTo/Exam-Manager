import { useCall } from "./useCall";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useAcceptSubjectResult } from "./useAcceptSubjectResult";
import { useRejectTestResult } from "./useRejectTestResult";
import { useResetSubject } from "./useResetSubject";
import { useEthers } from "@usedapp/core";

export function useStudentFunctions() {
  const { library } = useEthers();
  const { send: acceptSubjectResult } = useAcceptSubjectResult(library);
  const { send: rejectTestResult } = useRejectTestResult(library);
  const { send: resetSubject } = useResetSubject(library);
  return { acceptSubjectResult, rejectTestResult, resetSubject };
}

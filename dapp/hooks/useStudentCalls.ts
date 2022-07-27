import { JsonRpcProvider } from "@ethersproject/providers";
import { useTestFailedLogs } from "./useTestFailedLogs";
import { useTestPassedLogs } from "./useTestPassedLogs";
import { useSubjectAcceptedLogs } from "./useSubjectAcceptedLogs";
import { useSubjectPassedLogs } from "./useSubjectPassedLogs";
import { useSubjectResettedLogs } from "./useSubjectResettedLogs";
import { useStudentIds } from "./useStudentIds";
import { useTestAccepted } from "./useTestAcceptedLog";

export function useStudentCalls(
  provider: JsonRpcProvider | undefined,
  studentAddr: string | undefined
) {
  const { value } = useStudentIds(provider, studentAddr);
  const studentId = value && value[0].toNumber();
  const { value: testFailed } = useTestFailedLogs(provider, undefined, undefined, studentId);
  const { value: testPassed } = useTestPassedLogs(provider, undefined, undefined, studentId);
  const { value: testAccepted } = useTestAccepted(provider, undefined, undefined, studentId);
  const { value: subjectAccepted } = useSubjectAcceptedLogs(provider, undefined, studentId);
  const { value: subjectPassed } = useSubjectPassedLogs(provider, undefined, studentId);
  const { value: subjectResetted } = useSubjectResettedLogs(provider, undefined, studentId);
  return {
    studentId,
    testFailed,
    testPassed,
    testAccepted,
    subjectAccepted,
    subjectPassed,
    subjectResetted,
  };
}

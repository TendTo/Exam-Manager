import { useEthers } from "@usedapp/core";
import { PendingSubject } from "components";
import { useStudentCalls, useStudentFunctions } from "hooks";
import { UseLogsReturn } from "hooks/logs";
import { useMemo } from "react";
import { ExamContract } from "types";

function getTestsStatus(
  failed: UseLogsReturn<ExamContract, "TestFailed">["value"] = [],
  passed: UseLogsReturn<ExamContract, "TestPassed">["value"] = []
) {
  const allTests = [
    ...failed.map((test) => ({ ...test, passed: true })),
    ...passed.map((test) => ({ ...test, passed: false })),
  ];
  const sortedTests = allTests.sort((a, b) => a.blockNumber - b.blockNumber);
  return sortedTests.reduce((acc, test) => {
    if (acc[test.data.subjectId] === undefined) acc[test.data.subjectId] = {};
    acc[test.data.subjectId][test.data.testIdx] = {
      mark: test.data.mark,
      passed: test.passed,
    };
    return acc;
  }, {} as Record<string, Record<string, { mark: number; passed: boolean }>>);
}

function getSubjectStatus(
  accepted: UseLogsReturn<ExamContract, "SubjectAccepted">["value"] = [],
  passed: UseLogsReturn<ExamContract, "SubjectPassed">["value"] = [],
  resetted: UseLogsReturn<ExamContract, "SubjectResetted">["value"] = []
) {
  const allSubjects = [
    ...accepted.map((test) => ({ ...test, passed: false })),
    ...passed.map((test) => ({ ...test, passed: true })),
    ...resetted.map((test) => ({ ...test, passed: false })),
  ];
  const sortedSubjects = allSubjects.sort((a, b) => a.blockNumber - b.blockNumber);

  const subjectObject = sortedSubjects.reduce((acc, test) => {
    acc[test.data.subjectId] = {
      mark: test.data.mark,
      passed: test.passed,
    };
    return acc;
  }, {} as Record<number, { mark: number; passed: boolean }>);
  return [
    Object.entries(subjectObject).reduce((acc, [subjectId, tests]) => {
      if (tests.passed) acc.push({ mark: tests.mark, subjectId } as any);
      return acc;
    }, [] as { mark: number; subjectId: number }[]),
    accepted.map((test) => ({ mark: test.data.mark, subjectId: test.data.subjectId })),
  ] as const;
}

export default function Students() {
  const { library, account } = useEthers();
  const { acceptSubjectResult, rejectTestResult, resetSubject } = useStudentFunctions(library);
  const { studentId, subjectAccepted, subjectPassed, subjectResetted, testFailed, testPassed } =
    useStudentCalls(library, account);

  const tests = useMemo(() => getTestsStatus(testFailed, testPassed), [testFailed, testPassed]);
  const [subPending, subAccepted] = useMemo(
    () => getSubjectStatus(subjectAccepted, subjectPassed, subjectResetted),
    [subjectAccepted, subjectPassed, subjectResetted]
  );

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold">{studentId}</h1>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <div>Materie in Pending</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {subPending.map((subject) => (
                  <PendingSubject {...{ ...subject, library }} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

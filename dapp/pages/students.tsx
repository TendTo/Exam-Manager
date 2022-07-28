import { useEthers } from "@usedapp/core";
import { PendingSubject } from "components";
import AcceptedSubject from "components/acceptedSubject";
import { useStudentCalls } from "hooks";
import { UseLogsReturn } from "hooks/logs";
import { useMemo } from "react";
import { ExamContract } from "types";

type StudentCareer = {
  pending: SubjectResult;
  accepted: SubjectResult;
};

export type TestResult = Record<
  string,
  {
    mark: number;
    passed: boolean;
    canRefuse: boolean;
  }
>;
type SubjectResult = Record<
  string,
  {
    mark?: number;
    passed?: boolean;
    tests?: TestResult;
  }
>;

function getTestsStatus(
  failed: UseLogsReturn<ExamContract, "TestFailed">["value"] = [],
  passed: UseLogsReturn<ExamContract, "TestPassed">["value"] = [],
  accepted: UseLogsReturn<ExamContract, "TestAccepted">["value"] = []
) {
  const allTests = [
    ...failed.map((test) => ({ ...test, passed: false, canRefuse: false })),
    ...passed.map((test) => ({ ...test, passed: true, canRefuse: true })),
    ...accepted.map((test) => ({ ...test, passed: true, canRefuse: false })),
  ];
  const sortedTests = allTests.sort((a, b) => a.blockNumber - b.blockNumber);
  return sortedTests.reduce((acc, test) => {
    if (acc[test.data.subjectId] === undefined) acc[test.data.subjectId] = {};
    acc[test.data.subjectId][test.data.testIdx] = {
      mark: test.data.mark,
      passed: test.passed,
      canRefuse: test.canRefuse,
    };
    return acc;
  }, {} as Record<string, TestResult>);
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
  }, {} as SubjectResult);
  return {
    subPending: Object.entries(subjectObject).reduce((acc, [subjectId, subject]) => {
      if (subject.passed) acc[subjectId] = { mark: subject.mark, passed: true };
      return acc;
    }, {} as SubjectResult),
    subAccepted: accepted.reduce((acc, subject) => {
      acc[subject.data.subjectId] = { mark: subject.data.mark, passed: false };
      return acc;
    }, {} as SubjectResult),
  };
}

export default function Students() {
  const { library, account } = useEthers();
  const {
    studentId,
    subjectAccepted,
    subjectPassed,
    subjectResetted,
    testFailed,
    testPassed,
    testAccepted,
  } = useStudentCalls(library, account);

  const tests = useMemo(
    () => getTestsStatus(testFailed, testPassed, testAccepted),
    [testFailed, testPassed]
  );
  const { subPending, subAccepted } = useMemo(
    () => getSubjectStatus(subjectAccepted, subjectPassed, subjectResetted),
    [subjectAccepted, subjectPassed, subjectResetted]
  );

  const career = useMemo(() => {
    return Object.entries(tests).reduce(
      (acc, [subjectId, test]) => {
        if (subAccepted[subjectId] !== undefined) {
          acc.accepted[subjectId] = {
            mark: subAccepted[subjectId]?.mark,
            passed: subAccepted[subjectId]?.passed,
            tests: test,
          };
        } else {
          acc.pending[subjectId] = {
            mark: subPending[subjectId]?.mark,
            passed: subPending[subjectId]?.passed,
            tests: test,
          };
        }
        return acc;
      },
      { pending: {}, accepted: {} } as StudentCareer
    );
  }, [tests, subPending, subAccepted]);

  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-bold">Studente {studentId}</h1>
          <p className="text-xl" title={account}>
            {account}
          </p>
          <p className="py-6">
            Piattaforma <b>ufficialissima</b> del dipartimento di Informatica di Catania per la
            gestione degli esami universitari
          </p>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <div className="text-xl">Materie in Pending</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(career.pending).map(([subjectId, { tests, mark }]) => (
                  <PendingSubject
                    key={subjectId}
                    library={library}
                    mark={mark}
                    subjectId={subjectId}
                    tests={tests}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>
                    <div className="text-xl">Materie superate</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(career.accepted).map(([subjectId, { tests, mark }]) => (
                  <AcceptedSubject
                    key={subjectId}
                    library={library}
                    mark={mark}
                    subjectId={subjectId}
                    tests={tests}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

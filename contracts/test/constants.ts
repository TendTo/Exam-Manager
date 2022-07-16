import { IExamContract } from "../typechain-types";

/**
 * Errors the ExamContract can throw
 */
export enum Errors {
  UnauthorizedAdminError = "UnauthorizedAdminError",
  UnauthorizedProfessorError = "UnauthorizedProfessorError",
  TestDoesNotExistsError = "TestDoesNotExistsError",
  TestNotTakenError = "TestNotTakenError",
  TestAlreadyAcceptedError = "TestAlreadyAcceptedError",
  TestExpiredError = "TestExpiredError",
  TestNotAcceptableError = "TestNotAcceptableError",
  SubjectNotAcceptableError = "SubjectNotAcceptableError",
  SubjectAlreadyAcceptedError = "SubjectAlreadyAcceptedError",
  AddressAlreadyInUseError = "AddressAlreadyInUseError",
}

/**
 * Status of a test result
 */
export enum Status {
  NoVote,
  Passed,
  Accepted,
}

export const prog1 = { name: "Prog1", id: 123, cfu: 9, requiredCount: 0, subjectIdToUnlock: [412] };
export const prog2 = { name: "Prog2", id: 412, cfu: 9, requiredCount: 1, subjectIdToUnlock: [] };
export const calculus1 = {
  name: "Analisi 1",
  id: 420,
  cfu: 6,
  requiredCount: 0,
  subjectIdToUnlock: [],
};

export const prog1Tests: IExamContract.TestStruct[] = [
  {
    name: "Scritto",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [],
    testIdxReset: [],
    testIdxResetOnTake: [],
  },
  {
    name: "Orale",
    expiresIn: 10,
    minMark: 18,
    testIdxRequired: [[0]],
    testIdxReset: [0],
    testIdxResetOnTake: [],
  },
];

export const prog2Tests: IExamContract.TestStruct[] = [
  {
    name: "Scritto",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [],
    testIdxReset: [],
    testIdxResetOnTake: [],
  },
  {
    name: "Laboratorio",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [[1]],
    testIdxReset: [],
    testIdxResetOnTake: [],
  },
  {
    name: "Orale",
    expiresIn: 10,
    minMark: 18,
    testIdxRequired: [[2]],
    testIdxReset: [0, 1],
    testIdxResetOnTake: [],
  },
];

export const calculusTests: IExamContract.TestStruct[] = [
  {
    name: "Itinere 1",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [],
    testIdxReset: [],
    testIdxResetOnTake: [],
  },
  {
    name: "Itinere 2",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [[1]],
    testIdxReset: [0],
    testIdxResetOnTake: [],
  },
  {
    name: "Scritto",
    expiresIn: 100,
    minMark: 18,
    testIdxRequired: [],
    testIdxReset: [],
    testIdxResetOnTake: [0, 1],
  },
  {
    name: "Orale",
    expiresIn: 10,
    minMark: 18,
    testIdxRequired: [[0, 1], [2]],
    testIdxReset: [0, 1, 2],
    testIdxResetOnTake: [],
  },
];

import { ExamContract, IExamContract } from "../typechain-types";

/**
 * Errors the ExamContract can throw
 */
export enum Errors {
  UnauthorizedAdminError = "UnauthorizedAdminError",
  UnauthorizedProfessorError = "UnauthorizedProfessorError",
  TestDoesNotExistsError = "TestDoesNotExistsError",
}

/**
 * Parses a list of tests retrieved from the smart contract,
 * ensuring each object has only the expected properties.
 * @param tests list of tests retrieved from the smar contract
 * @returns parsed tests objects
 */
export function parseTests(tests: IExamContract.TestStructOutput[]) {
  return tests.map(({ expiresIn, name, optional }) => ({ expiresIn, name, optional }));
}

/**
 * Adds all the provided users to the smart contract and assigns to each of them
 * a StudentId equal to its position + 1.
 * @example 
 * await addAllStudents(contract, stud1, stud2, stud3);
 * // stud1 => 1
 * // stud2 => 2
 * // stud3 => 3
 * @param contract ExamContract smart contract
 * @param students ordered list of students to be added
 * @returns promise that, when awaited, ensures all students have been added
 */
export function addAllStudents(contract: ExamContract, ...students: string[]) {
  return Promise.all(students.map((student, i) => contract.addStudent(student, i + 1)));
}

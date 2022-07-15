import { expect } from "chai";
import { ethers } from "hardhat";
import { ExamContract__factory, ExamContract, IExamContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  addAllStudents,
  addSubject,
  Errors,
  parseTests as parseGetSubjectTests,
  Status,
  subject,
} from "./utils";

describe("ExamContract", function () {
  let contractFactory: ExamContract__factory;
  let contract: ExamContract,
    profContract: ExamContract,
    stud1Contract: ExamContract,
    stud2Contract: ExamContract,
    stud3Contract: ExamContract;
  let accounts: SignerWithAddress[];
  let admin: string, prof: string, stud1: string, stud2: string, stud3: string;

  before(async function () {
    accounts = await ethers.getSigners();
    [admin, prof, stud1, stud2, stud3] = accounts.map((a) => a.address);
    contractFactory = await ethers.getContractFactory("ExamContract");
  });

  beforeEach(async function () {
    contract = await contractFactory.deploy();
    [, profContract, stud1Contract, stud2Contract, stud3Contract] = accounts.map((a) =>
      contract.connect(a)
    );
  });

  describe("Admin", function () {
    it("Should revert with 'UnauthorizedAdminError'", async function () {
      await expect(profContract.addStudent(stud1, 1)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.deleteStudent(stud1)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.addSubject(1, "Name", 9, 0, [])).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.removeSubject(1)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.addAuthorizedProf(1, prof)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.removeAuthorizedProf(1, prof)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
    });

    it("Should be able to change address", async function () {
      // The student with studentId 1 is changing address stud1 => stud2
      await contract.addStudent(stud1, 1);
      expect(await contract.studentIds(stud1)).to.equal(1);

      await contract.addStudent(stud2, 1);
      expect(await contract.studentIds(stud2)).to.equal(1);
    });

    it("Should revert with 'AddressAlreadyInUseError'", async function () {
      // The student with studentId 2 is setting its address to stud1
      // which is already in use by the student with studentId 1
      await contract.addStudent(stud1, 1);
      expect(await contract.studentIds(stud1)).to.equal(1);

      expect(contract.addStudent(stud1, 2))
        .to.be.revertedWithCustomError(contract, Errors.AddressAlreadyInUseError)
        .withArgs(stud1);
    });

    it("Should set the admin", async function () {
      expect(await contract.admin()).to.equal(admin);
    });

    it("Should add a student", async function () {
      await contract.addStudent(stud1, 1);

      expect(await contract.studentIds(stud1)).to.equal(1);
    });

    it("Should delete a student", async function () {
      await contract.addStudent(stud1, 1);
      await contract.deleteStudent(stud1);

      expect(await contract.studentIds(stud1)).to.equal(0);
    });

    it("Should add a subject", async function () {
      await addSubject(contract);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal(subject.name);
      expect(cfu).to.equal(subject.cfu);

      const tests = await contract.getSubjectTests(subject.id);
      expect(tests.length).to.equal(0);
    });

    it("Should remove a subject", async function () {
      await addSubject(contract);
      await contract.removeSubject(subject.id);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal("");
      expect(cfu).to.equal(0);
    });

    it("Should add an authorized prof to subject", async function () {
      await addSubject(contract);

      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.false;
      await contract.addAuthorizedProf(subject.id, prof);

      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.true;
    });

    it("Should remove an authorized prof to subject", async function () {
      await addSubject(contract);

      await contract.addAuthorizedProf(subject.id, prof);
      await contract.removeAuthorizedProf(subject.id, prof);
      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.false;
    });
  });

  describe("Professor", function () {
    const tests: IExamContract.TestStruct[] = [
      {
        name: "Scritto",
        optional: false,
        expiresIn: 100,
        requiredCount: 0,
        testIdxToUnlock: [1],
      },
      {
        name: "Orale",
        optional: false,
        expiresIn: 10,
        requiredCount: 1,
        testIdxToUnlock: [],
      },
    ];
    const testResults: IExamContract.StudentMarkStruct[] = [
      { mark: 18, studentId: 1 },
      { mark: 25, studentId: 2 },
      { mark: 30, studentId: 3 },
    ];

    beforeEach(async function () {
      await addSubject(contract);
      await contract.addAuthorizedProf(subject.id, prof);
      await profContract.setSubjectTests(subject.id, tests);
      await addAllStudents(contract, stud1, stud2, stud3);
    });

    it("Should revert with 'UnauthorizedProfessorError'", async function () {
      expect(contract.registerTestResults(subject.id, 0, testResults))
        .to.be.revertedWithCustomError(contract, Errors.UnauthorizedProfessorError)
        .withArgs(subject.id, admin);
    });

    it("Should revert with 'TestDoesNotExistsError'", async function () {
      const testIdx = 0;
      expect(profContract.registerTestResults(subject.id, testIdx, testResults))
        .to.be.revertedWithCustomError(contract, Errors.TestDoesNotExistsError)
        .withArgs(subject.id, testIdx);
    });

    it("Should set the tests of a subject", async function () {
      await profContract.setSubjectTests(subject.id, tests);
      const testsResult = parseGetSubjectTests(await profContract.getSubjectTests(subject.id));
      for (let i in tests) {
        expect(testsResult[i].name).to.deep.equal(tests[i].name);
        expect(testsResult[i].expiresIn).to.deep.equal(tests[i].expiresIn);
        expect(testsResult[i].optional).to.deep.equal(tests[i].optional);
      }
    });

    it("Should register the marks for a list of students", async function () {
      const testIdx = 0;

      await profContract.setSubjectTests(subject.id, tests);
      await profContract.registerTestResults(subject.id, testIdx, testResults.slice(0, 2));

      expect(await stud1Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        testResults[0].mark,
        Status.Pending,
      ]);
      expect(await stud2Contract.getTestMark(subject.id, testIdx)).to.ordered.members([
        testResults[1].mark,
        Status.Pending,
      ]);
    });

    it("Should not register a mark for students that do not meet the test's dependencies requirements", async function () {
      const testIdx = 0,
        testIdx2 = 1;

      await profContract.setSubjectTests(subject.id, tests);
      // The third student didn't pass the exam
      await profContract.registerTestResults(subject.id, testIdx, testResults.slice(0, 1));
      await stud1Contract.acceptTestResult(subject.id, testIdx);
      await profContract.registerTestResults(subject.id, testIdx2, testResults.slice(0, 2));
      // TODO: add another registerTestResults for the dependency test for the third student

      expect(await stud1Contract.getTestMark(subject.id, testIdx2)).to.have.ordered.members([
        testResults[0].mark,
        Status.Pending,
      ]);
      expect(await stud2Contract.getTestMark(subject.id, testIdx2)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });
  });

  describe("Students", function () {
    const subject = { name: "Prog1", id: 123, cfu: 9, deps: [1, 2, 3] };
    const tests: IExamContract.TestStruct[] = [
      {
        name: "Scritto",
        optional: false,
        expiresIn: 100,
        requiredCount: 0,
        testIdxToUnlock: [1],
      },
      {
        name: "Orale",
        optional: false,
        expiresIn: 10,
        requiredCount: 1,
        testIdxToUnlock: [],
      },
    ];
    const testResults: IExamContract.StudentMarkStruct[] = [
      { mark: 18, studentId: 1 },
      { mark: 25, studentId: 2 },
      { mark: 30, studentId: 3 },
    ];

    beforeEach(async function () {
      await addSubject(contract);
      await contract.addAuthorizedProf(subject.id, prof);
      await profContract.setSubjectTests(subject.id, tests);
      await addAllStudents(contract, stud1, stud2, stud3);
    });

    it("Should accept a valid test result", async function () {
      const testIdx = 0;
      await profContract.registerTestResults(subject.id, testIdx, testResults.slice(0, 1));
      await stud1Contract.acceptTestResult(subject.id, testIdx);
      expect(await stud1Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        testResults[0].mark,
        Status.Accepted,
      ]);
    });

    it("Should revert with 'TestDoesNotExistsError'", async function () {
      const testIdx = 10;
      expect(stud1Contract.acceptTestResult(subject.id, testIdx))
        .to.be.revertedWithCustomError(contract, Errors.TestDoesNotExistsError)
        .withArgs(subject.id, testIdx);
    });

    it("Should revert with 'TestNotTakenError'", async function () {
      const testIdx = 0;
      expect(stud1Contract.acceptTestResult(subject.id, testIdx))
        .to.be.revertedWithCustomError(contract, Errors.TestNotTakenError)
        .withArgs(subject.id, testIdx, 1);
    });

    it("Should revert with 'TestAlreadyAcceptedError'", async function () {
      const testIdx = 0;
      await profContract.registerTestResults(subject.id, testIdx, testResults.slice(0, 1));
      await stud1Contract.acceptTestResult(subject.id, testIdx);
      expect(stud1Contract.acceptTestResult(subject.id, testIdx))
        .to.be.revertedWithCustomError(contract, Errors.TestAlreadyAcceptedError)
        .withArgs(subject.id, testIdx, 1);
    });

    it("Should revert with 'TestNotAcceptableError'", async function () {
      const testIdx = 0;
      await profContract.registerTestResults(subject.id, testIdx, [{ studentId: 1, mark: 10 }]);
      expect(stud1Contract.acceptTestResult(subject.id, testIdx))
        .to.be.revertedWithCustomError(contract, Errors.TestNotAcceptableError)
        .withArgs(subject.id, testIdx, 1, 10);
    });
  });
});

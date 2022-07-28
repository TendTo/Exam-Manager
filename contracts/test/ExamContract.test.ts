import { expect } from "chai";
import { ethers } from "hardhat";
import { ExamContract__factory, ExamContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { addStudents, addSubject, parseTests as parseGetSubjectTests } from "./utils";
import { Errors, prog1, prog1Tests, prog2, Status } from "./constants";

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

      await expect(contract.addStudent(stud1, 2))
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
      const { name, cfu } = await contract.subjects(prog1.id);
      expect(name).to.equal(prog1.name);
      expect(cfu).to.equal(prog1.cfu);

      const tests = await contract.getSubjectTests(prog1.id);
      expect(tests.length).to.equal(0);
    });

    it("Should add an authorized prof to subject", async function () {
      await addSubject(contract);

      expect(await contract.isProfAuthorized(prog1.id, prof)).to.be.false;
      await contract.addAuthorizedProf(prog1.id, prof);

      expect(await contract.isProfAuthorized(prog1.id, prof)).to.be.true;
    });

    it("Should remove an authorized prof to subject", async function () {
      await addSubject(contract);

      await contract.addAuthorizedProf(prog1.id, prof);
      await contract.removeAuthorizedProf(prog1.id, prof);
      expect(await contract.isProfAuthorized(prog1.id, prof)).to.be.false;
    });
  });

  describe("Professor", function () {
    beforeEach(async function () {
      await addSubject(contract, prog1);
      await addSubject(contract, prog2);
      await contract.addAuthorizedProf(prog1.id, prof);
      await contract.addAuthorizedProf(prog2.id, prof);
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await addStudents(contract, stud1, stud2, stud3);
    });

    it("Should revert with 'UnauthorizedProfessorError'", async function () {
      await expect(contract.registerTestResults(prog1.id, 0, []))
        .to.be.revertedWithCustomError(contract, Errors.UnauthorizedProfessorError)
        .withArgs(prog1.id, admin);
        
    });

    it("Should revert with 'TestDoesNotExistsError'", async function () {
      const testIdx = 10;
      await expect(
        profContract.registerTestResults(prog1.id, testIdx, [])
      ).to.be.revertedWithCustomError(contract, Errors.TestDoesNotExistsError);
    });

    it("Should set the tests of a subject", async function () {
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      const testsResult = parseGetSubjectTests(await profContract.getSubjectTests(prog1.id));
      for (let i in prog1Tests) {
        expect(testsResult[i].name).to.deep.equal(prog1Tests[i].name);
        expect(testsResult[i].expiresIn).to.deep.equal(prog1Tests[i].expiresIn);
      }
    });

    it("Should work even if the test result list is empty", async function () {
      const testIdx = 0;
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      expect(await profContract.registerTestResults(prog1.id, testIdx, [])).not.to.throw;
    });

    it("Should register the marks for a list of students who passed the test", async function () {
      const testIdx = 0;
      const testResults = [
        { mark: 18, studentId: 1 },
        { mark: 25, studentId: 2 },
      ];

      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await profContract.registerTestResults(prog1.id, testIdx, testResults);

      expect(await stud1Contract.getTestMark(prog1.id, testIdx, 1)).to.have.ordered.members([
        testResults[0].mark,
        Status.Passed,
      ]);
      expect(await stud2Contract.getTestMark(prog1.id, testIdx, 2)).to.have.ordered.members([
        testResults[1].mark,
        Status.Passed,
      ]);
    });

    it("Should not override an accepted test result", async function () {
      const testIdx1 = 0,
        testIdx2 = 1;
      const testResults1 = [{ mark: 18, studentId: 1 }];
      const testResults2 = [{ mark: 19, studentId: 1 }];

      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await profContract.registerTestResults(prog1.id, testIdx1, testResults1);
      await profContract.registerTestResults(prog1.id, testIdx2, testResults1);
      // The fact that the student took the second test makes the first one accepted
      expect(await stud1Contract.getTestMark(prog1.id, testIdx1, 1)).to.have.ordered.members([
        testResults1[0].mark,
        Status.Accepted,
      ]);
      // If the professor tries to override an accepted test result, nothing changes
      await profContract.registerTestResults(prog1.id, testIdx1, testResults2);
      expect(await stud1Contract.getTestMark(prog1.id, testIdx1, 1)).to.have.ordered.members([
        testResults1[0].mark,
        Status.Accepted,
      ]);
    });

    it("Should not register a mark for students that do not meet the test's dependencies requirements", async function () {
      const testIdx1 = 0,
        testIdx2 = 1;
      const testResults1 = [
        { mark: 18, studentId: 1 },
        { mark: 15, studentId: 2 },
      ];
      const testResults2 = [
        { mark: 20, studentId: 1 },
        { mark: 25, studentId: 2 },
      ];

      await profContract.setSubjectTests(prog1.id, prog1Tests);
      // The student with studentId 2 didn't pass the first test
      await profContract.registerTestResults(prog1.id, testIdx1, testResults1);
      await profContract.registerTestResults(prog1.id, testIdx2, testResults2);

      // Since he took the second test, the first one is now locked with the status 'Accepted'
      expect(await stud1Contract.getTestMark(prog1.id, testIdx1, 1)).to.have.ordered.members([
        testResults1[0].mark,
        Status.Accepted,
      ]);
      expect(await stud1Contract.getTestMark(prog1.id, testIdx2, 1)).to.have.ordered.members([
        testResults2[0].mark,
        Status.Passed,
      ]);
      // No votes have been registered for the second student, because he didn't pass the first test
      // and could not take the second test
      expect(await stud2Contract.getTestMark(prog1.id, testIdx1, 2)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
      expect(await stud2Contract.getTestMark(prog1.id, testIdx2, 2)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });

    it("Should not register a subject result if the requirements are not met", async function () {
      const subjectResults = [{ mark: 18, studentId: 1 }];
      await profContract.registerSubjectResults(prog2.id, subjectResults);
      expect(await stud1Contract.getSubjectMark(prog2.id, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });

    it("Should register a subject result if there are no requirements", async function () {
      const subjectResults = [{ mark: 18, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        subjectResults[0].mark,
        Status.Passed,
      ]);
    });

    it("Should not be able to override an accepted result", async function () {
      const subjectResults1 = [{ mark: 18, studentId: 1 }];
      const subjectResults2 = [{ mark: 30, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults1);
      await stud1Contract.acceptSubjectResult(prog1.id);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        subjectResults1[0].mark,
        Status.Accepted,
      ]);
      await profContract.registerSubjectResults(prog1.id, subjectResults2);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        subjectResults1[0].mark,
        Status.Accepted,
      ]);
    });

    it("Should not register a subject result if the student has yet to accept the required subjects", async function () {
      const subjectResults = [{ mark: 18, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await profContract.registerSubjectResults(prog2.id, subjectResults);
      expect(await stud1Contract.getSubjectMark(prog2.id, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });

    it("Should register a subject result if the requirements are met (the student accepted the mark of required subject)", async function () {
      const subjectResults = [{ mark: 18, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await stud1Contract.acceptSubjectResult(prog1.id);
      await profContract.registerSubjectResults(prog2.id, subjectResults);
      expect(await stud1Contract.getSubjectMark(prog2.id, 1)).to.have.ordered.members([
        subjectResults[0].mark,
        Status.Passed,
      ]);
    });
  });

  describe("Students", function () {
    beforeEach(async function () {
      await addSubject(contract);
      await contract.addAuthorizedProf(prog1.id, prof);
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await addStudents(contract, stud1, stud2, stud3);
    });

    it("Should accept a valid test result", async function () {
      const testIdx = 0;
      const testResults = [{ mark: 18, studentId: 1 }];

      await profContract.registerTestResults(prog1.id, testIdx, testResults);
      expect(await stud1Contract.getTestMark(prog1.id, testIdx, 1)).to.have.ordered.members([
        testResults[0].mark,
        Status.Passed,
      ]);
    });

    it("Should revert with 'TestDoesNotExistsError'", async function () {
      const testIdx = 10;
      await expect(stud1Contract.rejectTestResult(prog1.id, testIdx))
        .to.be.revertedWithCustomError(contract, Errors.TestDoesNotExistsError)
    });

    it("Should revert with 'TestAlreadyAcceptedError'", async function () {
      const testIdx1 = 0,
        testIdx2 = 1;

      const testResults = [{ mark: 18, studentId: 1 }];
      await profContract.registerTestResults(prog1.id, testIdx1, testResults);
      await profContract.registerTestResults(prog1.id, testIdx2, testResults);
      await expect(stud1Contract.rejectTestResult(prog1.id, testIdx2))
        .to.be.revertedWithCustomError(contract, Errors.TestAlreadyAcceptedError)
        .withArgs(prog1.id, testIdx2, 1);
    });

    it("Should reject a test result", async function () {
      const testIdx = 0;
      const testResults = [{ mark: 18, studentId: 1 }];

      await profContract.registerTestResults(prog1.id, testIdx, testResults);
      expect(await stud1Contract.getTestMark(prog1.id, testIdx, 1)).to.have.ordered.members([
        18,
        Status.Passed,
      ]);

      await stud1Contract.rejectTestResult(prog1.id, testIdx);
      expect(await stud1Contract.getTestMark(prog1.id, testIdx, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });

    it("Should raise 'SubjectNotAcceptableError'", async function () {
      await expect(stud1Contract.acceptSubjectResult(prog1.id))
        .to.be.revertedWithCustomError(contract, Errors.SubjectNotAcceptableError)
        .withArgs(prog1.id, 1);
    });

    it("Should raise 'SubjectAlreadyAcceptedError'", async function () {
      const subjectResults = [{ mark: 24, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await stud1Contract.acceptSubjectResult(prog1.id);
      await expect(stud1Contract.acceptSubjectResult(prog1.id))
        .to.be.revertedWithCustomError(contract, Errors.SubjectAlreadyAcceptedError)
        .withArgs(prog1.id, 1);
    });

    it("Should accept a subject result", async function () {
      const subjectResults = [{ mark: 24, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await stud1Contract.acceptSubjectResult(prog1.id);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        subjectResults[0].mark,
        Status.Accepted,
      ]);
    });

    it("Should raise 'SubjectNotAcceptableError'", async function () {
      await expect(stud1Contract.resetSubject(prog1.id))
        .to.be.revertedWithCustomError(contract, Errors.SubjectNotAcceptableError)
        .withArgs(prog1.id, 1);
    });

    it("Should raise 'SubjectAlreadyAcceptedError'", async function () {
      const subjectResults = [{ mark: 24, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await stud1Contract.acceptSubjectResult(prog1.id);
      await expect(stud1Contract.resetSubject(prog1.id))
        .to.be.revertedWithCustomError(contract, Errors.SubjectAlreadyAcceptedError)
        .withArgs(prog1.id, 1);
    });

    it("Should reject a subject and reset it", async function () {
      const subjectResults = [{ mark: 24, studentId: 1 }];
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        subjectResults[0].mark,
        Status.Passed,
      ]);
      await stud1Contract.resetSubject(prog1.id);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });

    it("Should reset a subject completely", async function () {
      const testIdx = 0;
      const testResults = [{ mark: 18, studentId: 1 }];
      const subjectResults = [{ mark: 24, studentId: 1 }];
      await profContract.registerTestResults(prog1.id, testIdx, testResults);
      await profContract.registerSubjectResults(prog1.id, subjectResults);
      await stud1Contract.resetSubject(prog1.id);

      expect(await stud1Contract.getTestMark(prog1.id, testIdx, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
      expect(await stud1Contract.getSubjectMark(prog1.id, 1)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });
  });

  describe("Complete flow", function () {
    it("Student1 should pass prog1", async function () {
      const stud1Id = 100101;
      await contract.addStudent(stud1, stud1Id);
      await contract.addSubject(
        prog1.id,
        prog1.name,
        prog1.cfu,
        prog1.requiredCount,
        prog1.subjectIdToUnlock
      );
      await contract.addAuthorizedProf(prog1.id, prof);
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await profContract.registerTestResults(prog1.id, 0, [{ mark: 26, studentId: stud1Id }]);
      await profContract.registerTestResults(prog1.id, 1, [{ mark: 30, studentId: stud1Id }]);
      await profContract.registerSubjectResults(prog1.id, [{ mark: 28, studentId: stud1Id }]);
      await stud1Contract.acceptSubjectResult(prog1.id);

      expect(await stud1Contract.getSubjectMark(prog1.id, stud1Id)).to.have.ordered.members([
        28,
        Status.Accepted,
      ]);
    });

    it("Student1 should pass prog1 after failing the 'Orale' the first time", async function () {
      const stud1Id = 100101;
      await contract.addStudent(stud1, stud1Id);
      await contract.addSubject(
        prog1.id,
        prog1.name,
        prog1.cfu,
        prog1.requiredCount,
        prog1.subjectIdToUnlock
      );
      await contract.addAuthorizedProf(prog1.id, prof);
      await profContract.setSubjectTests(prog1.id, prog1Tests);
      await profContract.registerTestResults(prog1.id, 0, [{ mark: 26, studentId: stud1Id }]);
      await profContract.registerTestResults(prog1.id, 1, [{ mark: 10, studentId: stud1Id }]);
      expect(await stud1Contract.getTestMark(prog1.id, 1, stud1Id)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
      // Can't repeat the test directly: must redo the 'Scritto'
      await profContract.registerTestResults(prog1.id, 1, [{ mark: 30, studentId: stud1Id }]);
      expect(await stud1Contract.getTestMark(prog1.id, 1, stud1Id)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
      await profContract.registerTestResults(prog1.id, 0, [{ mark: 28, studentId: stud1Id }]);
      await profContract.registerTestResults(prog1.id, 1, [{ mark: 30, studentId: stud1Id }]);
      await profContract.registerSubjectResults(prog1.id, [{ mark: 29, studentId: stud1Id }]);
      await stud1Contract.acceptSubjectResult(prog1.id);

      expect(await stud1Contract.getSubjectMark(prog1.id, stud1Id)).to.have.ordered.members([
        29,
        Status.Accepted,
      ]);
    });
  });
});

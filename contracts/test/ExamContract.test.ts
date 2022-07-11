import { expect } from "chai";
import { ethers } from "hardhat";
import { ExamContract__factory, ExamContract, IExamContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { addAllStudents, Errors, parseTests as parseGetSubjectTests } from "./utils";

    enum Status {
        NoVote,
        Pending,
        Accepted,
        Rejected
    }

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
    const subject = { name: "Prog1", id: 123, cfu: 9, deps: [1, 2, 3] };

    it("Should revert with 'UnauthorizedAdminError'", async function () {
      await expect(profContract.addStudent(stud1, 1)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.deleteStudent(stud1)).to.be.revertedWithCustomError(
        contract,
        Errors.UnauthorizedAdminError
      );
      await expect(profContract.addSubject(1, "Name", 9, [])).to.be.revertedWithCustomError(
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
      await contract.addSubject(subject.id, subject.name, subject.cfu, subject.deps);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal(subject.name);
      expect(cfu).to.equal(subject.cfu);

      const tests = await contract.getSubjectTests(subject.id);
      expect(tests.length).to.equal(0);
    });

    it("Should remove a subject", async function () {
      await contract.addSubject(subject.id, subject.name, subject.cfu, []);
      await contract.removeSubject(subject.id);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal("");
      expect(cfu).to.equal(0);
    });

    it("Should add an authorized prof to subject", async function () {
      await contract.addSubject(subject.id, subject.name, subject.cfu, []);

      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.false;
      await contract.addAuthorizedProf(subject.id, prof);

      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.true;
    });

    it("Should remove an authorized prof to subject", async function () {
      await contract.addSubject(subject.id, subject.name, subject.cfu, []);

      await contract.addAuthorizedProf(subject.id, prof);
      await contract.removeAuthorizedProf(subject.id, prof);
      expect(await contract.isProfAuthorized(subject.id, prof)).to.be.false;
    });
  });

  describe("Professor", function () {
    const subject = { name: "Prog1", id: 123, cfu: 9, deps: [1, 2, 3] };
    const tests: IExamContract.TestStruct[] = [
      {
        name: "Scritto",
        optional: false,
        expiresIn: 100,
        testIdxRequired: [],
      },
      {
        name: "Orale",
        optional: false,
        expiresIn: 10,
        testIdxRequired: [0],
      },
    ];
    const testResults: IExamContract.StudentMarkStruct[] = [
      { mark: 18, studentId: 1 },
      { mark: 25, studentId: 2 },
      { mark: 30, studentId: 3 },
    ];

    beforeEach(async function () {
      contract.addSubject(subject.id, subject.name, subject.cfu, subject.deps);
      contract.addAuthorizedProf(subject.id, prof);
      contract.setSubjectTests(subject.id, tests);
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
      await addAllStudents(contract, stud1, stud2, stud3);

      await profContract.setSubjectTests(subject.id, tests);
      await profContract.registerTestResults(subject.id, testIdx, testResults);

      expect(await stud1Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        testResults[0].mark,
        Status.Pending,
      ]);
      expect(await stud2Contract.getTestMark(subject.id, testIdx)).to.ordered.members([
        testResults[1].mark,
        Status.Pending,
      ]);
      expect(await stud3Contract.getTestMark(subject.id, testIdx)).to.ordered.members([
        testResults[2].mark,
        Status.Pending,
      ]);
    });

    it("Should not register a mark for students that do not meet the test's dependencies requirements", async function () {
      const testIdx = 0;
      await addAllStudents(contract, stud1, stud2, stud3);

      await profContract.setSubjectTests(subject.id, tests);
      // The third student didn't pass the exam
      await profContract.registerTestResults(subject.id, testIdx, testResults.slice(0, 2));

      expect(await stud1Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        testResults[0].mark,
        Status.Pending,
      ]);
      expect(await stud2Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        testResults[1].mark,
        Status.Pending,
      ]);
      expect(await stud3Contract.getTestMark(subject.id, testIdx)).to.have.ordered.members([
        0,
        Status.NoVote,
      ]);
    });
  });
});

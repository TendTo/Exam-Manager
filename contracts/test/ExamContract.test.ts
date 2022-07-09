import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { ExamContract__factory, ExamContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

describe("ExamContract", function () {
  let contractFactory: ExamContract__factory;
  let contract: ExamContract;
  let accounts: SignerWithAddress[];
  let admin: string, addr1: string, addr2: string;

  before(async () => {
    accounts = await ethers.getSigners();
    [admin, addr1, addr2] = accounts.map((a) => a.address);
    contractFactory = await ethers.getContractFactory("ExamContract");
  });

  beforeEach(async function () {
    contract = await contractFactory.deploy();
  });

  describe("Admin", function () {

    it("Only the admin can calls these functions", async function () {
      await expect(contract.addStudent(addr1, 1, {from: addr1})).to.be.rejected;
      await expect(contract.deleteStudent(addr1, { from: addr1 })).to.be.rejected;
      await expect(contract.addSubject(addr1, "Name", 9, [], {from: addr1})).to.be.rejected;
      await expect(contract.removeSubject(1, { from: addr2 })).to.be.rejected;
      await expect(contract.addAuthorizedProf(1, addr1, { from: addr1 })).to.be.rejected;
      await expect(contract.removeAuthorizedProf(1, addr1, { from: addr1 })).to.be.rejected
    })

    it("Should set the admin", async function () {
      expect(await contract.admin()).to.equal(admin);
    });

    it("Should add a student", async function () {
      await contract.addStudent(addr1, 1);

      expect(await contract.studentIds(addr1)).to.equal(1);
    })

    it("Should delete a student", async function () {
      await contract.addStudent(addr1, 1);
      await contract.deleteStudent(addr1);

      expect(await contract.studentIds(addr1)).to.equal(0);
    })

    // function addSubject
    it("Should add a subject", async function () {

      const subject = {name: "Prog1", id: 123, cfu: 9, deps: [1, 2, 3]};
      
      await contract.addSubject(subject.id,subject.name,subject.cfu,subject.deps);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal(subject.name);
      expect(cfu).to.equal(subject.cfu);

      const tests = await contract.getSubjectTests(subject.id);
      expect(tests.length).to.equal(0);
    })

    it("Should remove a subject", async function () {
      
      const subject = {name: "Prog1", id: 123, cfu: 9};
      
      await contract.addSubject(subject.id,subject.name,subject.cfu,[]);
      await contract.removeSubject(subject.id);
      const { name, cfu } = await contract.subjects(subject.id);
      expect(name).to.equal("");
      expect(cfu).to.equal(0);
    })

    it("Should add an authorized prof to subject", async function () {
      
      const subject = {name: "Prog1", id: 123, cfu: 9};
      await contract.addSubject(subject.id,subject.name,subject.cfu,[]);
      
      expect(await contract.isProfAuthorized(subject.id, addr1)).to.equal(false);
      await contract.addAuthorizedProf(subject.id, addr1);

      expect(await contract.isProfAuthorized(subject.id, addr1)).to.equal(true);      

    })

    it("Should remove an authorized prof to subject", async function () {
      
      const subject = {name: "Prog1", id: 123, cfu: 9};
      await contract.addSubject(subject.id,subject.name,subject.cfu,[]);

      await contract.addAuthorizedProf(subject.id, addr1);      
      await contract.removeAuthorizedProf(subject.id, addr1);
      expect(await contract.isProfAuthorized(subject.id, addr1)).to.equal(false);

    })
  });
  

});

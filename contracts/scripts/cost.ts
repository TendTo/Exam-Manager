import { ethers } from "hardhat";
import { prog1, prog1Tests } from "../test/constants";
import { addStudents, addSubject } from "../test/utils";
import { ExamContract } from "../typechain-types";

async function registerTest(students: string[], profContract: ExamContract, testIdx: number) {
  const tx = await profContract.registerTestResults(
    prog1.id,
    testIdx,
    students.map((_, i) => ({ mark: 30, studentId: i + 1 })),
    // Gas price is the base fee: can't be lower
    { gasPrice: 48421706 }
  );
  const receipt = await tx.wait();
  const cost = receipt.gasUsed.mul(receipt.effectiveGasPrice);
  console.log(
    `------
    For the examId ${testIdx}
    Gas used: ${receipt.gasUsed}, Gas Price: ${receipt.effectiveGasPrice}
    Cost: ${ethers.utils.formatEther(cost)} ETH`
  );
}

async function main() {
  const accounts = await ethers.getSigners();
  const students = accounts.slice(2).map((a) => a.address);
  const [, prof] = accounts.map((a) => a.address);
  const contractFactory = await ethers.getContractFactory("ExamContract");
  const contract = await contractFactory.deploy();
  const profContract = contract.connect(accounts[1]);

  await addSubject(contract);
  await contract.addAuthorizedProf(prog1.id, prof);
  await profContract.setSubjectTests(prog1.id, prog1Tests);

  await addStudents(contract, ...students);

  await registerTest(students, profContract, 0);
  await registerTest(students, profContract, 1);

  console.log("Length accounts: ", accounts.length);
  const res = await contract.connect(accounts[2]).getTestMark(prog1.id, 1);
  console.log(res);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

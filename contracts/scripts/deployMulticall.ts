import { ethers } from "hardhat";

async function main() {
  const contractFactory = await ethers.getContractFactory("Multicall");
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log("Multicall deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

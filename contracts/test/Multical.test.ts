import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { Multicall, Multicall__factory } from "../typechain-types";
import { expect } from "chai";

describe("Multicall", function () {
  let contractFactory: Multicall__factory;
  let contract: Multicall;
  let accounts: SignerWithAddress[];
  let admin: string;

  before(async function () {
    accounts = await ethers.getSigners();
    admin = accounts[0].address;
    contractFactory = await ethers.getContractFactory("Multicall");
  });

  beforeEach(async function () {
    contract = await contractFactory.deploy();
  });

  describe("Utility methods", function () {
    it("should be able to get the balance of the provided address", async function () {
      expect(await contract.getEthBalance(admin)).to.be.equal(await accounts[0].getBalance());
    });
  });
});

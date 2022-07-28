import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const RPC_URL = process.env.RPC_URL ?? "RPC url";
const ROPSTEN_SK = process.env.ROPSTEN_SK ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: RPC_URL,
      accounts: ROPSTEN_SK ? [ROPSTEN_SK] : [],
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["9c7a6375a3acf88b8f9cee2ccb039b7f5baa9ba86b4b39b9208062c7c92a3b99"],
      chainId: 1337,
    },
  },
};

export default config;

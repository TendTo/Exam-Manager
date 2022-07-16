import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? "ALKEMY API KEY";
const ROPSTEN_PK = process.env.ROPSTEN_PK ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: ROPSTEN_PK ? [ROPSTEN_PK] : [],
    },
    ganache: {
      url: "http://127.0.0.1:7545",
      accounts: ["9c7a6375a3acf88b8f9cee2ccb039b7f5baa9ba86b4b39b9208062c7c92a3b99"],
      chainId: 1337,
    },
  },
};

export default config;

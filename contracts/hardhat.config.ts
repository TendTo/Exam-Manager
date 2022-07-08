import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? "ALKEMY API KEY";
const ROPSTEN_PK = process.env.ROPSTEN_PK ?? "YOUR ROPSTEN PRIVATE KEY";

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      accounts: [ROPSTEN_PK],
    },
  },
};

export default config;

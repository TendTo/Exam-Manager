
# Exam Manager

![nodejs](https://badgen.net/badge/node/v16.16.0/blue)
![npm](https://badgen.net/badge/npm/v8.15.0/blue?icon=npm)  
[![Contract tests](https://github.com/TendTo/Exam-Manager/actions/workflows/contract-tests.yml/badge.svg)](https://github.com/TendTo/Exam-Manager/actions/workflows/contract-tests.yml)
[![Deploy to Github Pages](https://github.com/TendTo/Exam-Manager/actions/workflows/github-page.yml/badge.svg)](https://github.com/TendTo/Exam-Manager/actions/workflows/github-page.yml)
[![Latex CI](https://github.com/TendTo/Exam-Manager/actions/workflows/latex.yml/badge.svg)](https://github.com/TendTo/Exam-Manager/actions/workflows/latex.yml)  
[![codecov](https://codecov.io/gh/TendTo/Exam-Manager/branch/master/graph/badge.svg?token=1QU7EY32HS)](https://codecov.io/gh/TendTo/Exam-Manager)


[DApp](https://tendto.github.io/Exam-Manager) for managing student's accademic exams and tests powered by a [smart contract](https://goerli.etherscan.io/address/0x73781629D73AFeabA98A5691DF37dC0433392995#code) deployed on the [Goerli](https://goerli.etherscan.io/) testnet.

## Installation

### Requirements
- [nodejs](https://nodejs.org/it/)
- [npm](https://www.npmjs.com/)

### Steps

#### Install dependencies

Install the dependencies with npm

```bash
npm install
```

#### Compile contract

Compile the smart contracts

```bash
npm run compile
```

#### Deploy contract

Deploy the contract on Goerli.

There are many methods to do this, for example using the online editor [Remix](https://remix.ethereum.org/).

If you want to use the Hardhat library, you need to provide a Goerli node's RPC url and a private key of an account with sufficient funds.
All these settings can be specified as environment variables or in a .env file in the contracts' directory.

```env
RPC_URL=https://goerli.infura.io/v3/123
SK=<secret key>
```

```bash
npm run deploy:goerli
```
#### Run DApp

Launch a local version of the DApp

```bash
npm start
```


## Running test

To run tests, make sure you have installed the dependencies and run the following command

```bash
npm test
```


## FAQ

#### Is there a backdoor??!?!

You can obtain some extra CFU by clicking the secret hidden button at the top right of the page!

## Authors

- [@codesimo](https://www.github.com/codesimo)
- [@TendTo](https://www.github.com/TendTo)

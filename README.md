# 🏗 Scaffold-Eth Typescript

## Typescript

This is the typescript repo of scaffold-eth. It has the a command line system that allows you to choose a **react frontend** with `nextjs` or `vite`. You can also use `hardhat` or `foundry` as your solidity toolkit.

The directories that you'll use are:

```bash
packages/solidity-ts/

And one of either:
packages/vite-app-ts/
packages/next-app-ts/
```

## Quick Start

### Commands to run the app

Running the app

1. install your dependencies, `open a new command prompt`

   ```bash
   yarn install
   ```

2. Setup your default configuration

   ```bash
   yarn reset-config
   ```

3. start a hardhat node

   ```bash
   yarn chain
   ```

4. run the app, `open a new command prompt`

   ```bash
   # compile your contracts
   yarn compile
   # deploy your hardhat contracts
   yarn deploy
   # start the app (vite)
   yarn start
   ```

5. other commands

   ```bash
   # rebuild all contracts, incase of inconsistent state
   yarn contracts:clean
   yarn contracts:build
   # run hardhat commands for the workspace, or see all tasks
   yarn hardhat 'xxx'
   # run forge, anvil or
   yarn forge
   yarn anvil
   yarn cast
   # run any subgraph commands for the workspace
   yarn subgraph 'xxx'
   ```

   Other folders

   ```bash
   # for subgraph
   packages/subgraph/
   # other services: like graphql
   packages/services/
   ```

### Configuration

Scaffold uses `scaffold.config.json` as a configuration file located in `/packages/common/scaffold.config.json`

#### Command line help

```bash
use `-h` with any command for help.  e.g. yarn set-react -h
```

#### Configure react and solidity

You can change the configuration file to pick different frontends and solidity toolkits.

```bash
yarn set-react `nextjs` or `vite`
yarn set-solidity `hardhat` or `foundry`
```

You can see all the other commands by using `yarn scaffold`

#### Target network

Set your `targetNetwork` in the config. This is the network the solidity toolkit is deploying against.

Set your `availableNetworks` in the config. This is the networks the frontend is available in.

You can configure it from the **config file** or from **command line**.

```bash
yarn set-network -h
yarn set-network 'localhost' 'localhost, mainnet'
```

## Overview

Everything you need to build on Ethereum! 🚀 Quickly experiment with Solidity using a frontend that adapts to your smart contract:

![image](https://user-images.githubusercontent.com/2653167/124158108-c14ca380-da56-11eb-967e-69cde37ca8eb.png)

- 🔏 Edit your smart contract `YourContract.sol` in `packages/solidity-ts/contracts`
- 📝 Edit your frontend `MainPage.tsx` in `packages/vite-app-ts/src`
- 💼 Edit your deployment scripts in `packages/solidity-ts/deploy/hardhat-deploy`
- 📱 Open http://localhost:3000 to see the app
- 👷🏽‍♂️ run `yarn hardhat` to get a list of all the tasks. Run `yarn hardhat taskname` to run the task.

<br/><br/><br/>

---

# Guides

## Documentation

- Check out [eth-hooks docs](https://scaffold-eth.github.io/eth-ui) for example of how to use hooks

## 🏃💨 Speedrun Ethereum

Register as a builder [here](https://speedrunethereum.com) and start on some of the challenges and build a portfolio.

> 🏁 Make sure to click on the typescript tab!

<br/><br/><br/>

---

# More Information!

## 📚 Documentation

Eth-hooks documentation is [here](https://scaffold-eth.github.io/eth-hooks/). Learn how to use the contexts here.

## 💬 Support Chat

Join the telegram [support chat 💬](https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA) to ask questions and find others building with 🏗 scaffold-eth!

## 🛠 Buidl

Check out

- [Typescript challenges](https://github.com/scaffold-eth/scaffold-eth-typescript-challenges)
- [Typescript examples](https://github.com/scaffold-eth/scaffold-eth-typescript-examples)
- [Vanilla JS active branches](https://github.com/scaffold-eth/scaffold-eth/branches/active)
- Join/fund the 🏰 [BuidlGuidl](https://BuidlGuidl.com)!

### 🙏🏽 Support us!

Please check out our [Gitcoin grant](https://gitcoin.co/grants/2851/scaffold-eth) too!

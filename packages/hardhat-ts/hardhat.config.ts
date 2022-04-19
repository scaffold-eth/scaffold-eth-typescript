/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/order */
// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

import './helpers/hardhat-imports';

import path from 'path';
import chalk from 'chalk';
import glob from 'glob';

import { getNetworks } from 'scaffold-common/src/functions';
import { HardhatUserConfig, task } from 'hardhat/config';

import { config as envConfig } from 'dotenv';
import { getMnemonic } from './tasks/functions/mnemonic';
import { removeConsoleLog } from 'hardhat-preprocessor';

// this loads the .env file into process.env
envConfig({ path: '../vite-app-ts/.env' });

/**
 * this loads all the tasks from the tasks folder
 */
if (process.env.BUILDING !== 'true') {
  glob.sync('./tasks/**/*.ts').forEach((file: string) => {
    require(path.resolve(file));
  });
}

/**
 * Set your target network!!!
 */
console.log('HARDHAT_TARGET_NETWORK: ', process.env.HARDHAT_TARGET_NETWORK);

/**
 * loads network list and config from scaffold-common
 */
const networks = {
  ...getNetworks({
    accounts: {
      mnemonic: getMnemonic(),
    },
  }),
  localhost: {
    url: 'http://localhost:8545',
    /*
      if there is no mnemonic, it will just use account 0 of the hardhat node to deploy
      (you can put in a mnemonic here to set the deployer locally)
    */
    // accounts: {
    //   mnemonic: getMnemonic(),
    // },
  },
};

export const config: HardhatUserConfig = {
  preprocess: {
    eachLine: removeConsoleLog((hre) => hre.network.name !== 'hardhat' && hre.network.name !== 'localhost'),
  },
  defaultNetwork: process.env.HARDHAT_TARGET_NETWORK,
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
    },
  },
  // don't forget to set your provider like:
  // REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
  // (then your frontend will talk to your contracts on the live network!)
  // (you will need to restart the `yarn run start` dev server after editing the .env)

  networks: networks,
  solidity: {
    compilers: [
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
          outputSelection: {
            '*': {
              '*': ['storageLayout'],
            },
          },
        },
      },
    ],
  },
  paths: {
    cache: './generated/cache',
    artifacts: './generated/artifacts',
    deployments: './generated/deployments',
  },
  typechain: {
    outDir: './generated/contract-types',
  },
};
export default config;
// task('mineContractAddress', 'Looks for a deployer account that will give leading zeros')
//   .addParam('searchFor', 'String to search for')
//   .setAction(async (taskArgs, { network, ethers }) => {
//     let contractAddress = '';
//     let address;

//     const bip39 = require('bip39');
//     const hdkey = require('ethereumjs-wallet/hdkey');

//     let mnemonic = '';
//     while (contractAddress.indexOf(taskArgs.searchFor) != 0) {
//       mnemonic = bip39.generateMnemonic();
//       if (DEBUG) console.log('mnemonic', mnemonic);
//       const seed = await bip39.mnemonicToSeed(mnemonic);
//       if (DEBUG) console.log('seed', seed);
//       const hdwallet = hdkey.fromMasterSeed(seed);
//       const walletHdPath = "m/44'/60'/0'/0/";
//       const accountIndex = 0;
//       const fullPath = walletHdPath + accountIndex;
//       if (DEBUG) console.log('fullPath', fullPath);
//       const wallet = hdwallet.derivePath(fullPath).getWallet();
//       const privateKey = `0x${wallet._privKey.toString('hex')}`;
//       if (DEBUG) console.log('privateKey', privateKey);
//       const EthUtil = require('ethereumjs-util');
//       address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;

//       const rlp = require('rlp');
//       const keccak = require('keccak');

//       const nonce = 0x00; // The nonce must be a hex literal!
//       const sender = address;

//       const inputArr = [sender, nonce];
//       const rlpEncoded = rlp.encode(inputArr);

//       const contractAddressLong = keccak('keccak256').update(rlpEncoded).digest('hex');

//       contractAddress = contractAddressLong.substring(24); // Trim the first 24 characters.
//     }

//     console.log(`⛏  Account Mined as ${address} and set as mnemonic in packages/hardhat`);
//     console.log(`📜 This will create the first contract: ${chalk.magenta(`0x${contractAddress}`)}`);
//     console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

//     fs.writeFileSync(`./generated/${address}_produces${contractAddress}.txt`, mnemonic.toString());
//     fs.writeFileSync(mnemonicPath, mnemonic.toString());
//   });

/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';

import { task } from 'hardhat/config';
import { debugLog } from 'tasks/helpers/debug';

import { mnemonicPath } from './mnemonic';

task('generate', 'Create a mnemonic for builder deploys', async (_, _hre) => {
  const bip39 = require('bip39');
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic();
  debugLog('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  debugLog('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdPath + accountIndex.toString();
  debugLog('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString('hex')}`;
  debugLog('privateKey', privateKey);
  const EthUtil = require('ethereumjs-util');
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;
  console.log(`🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`);
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

  fs.writeFileSync(`./generated/${address}.secret`, mnemonic.toString());
  fs.writeFileSync(mnemonicPath, mnemonic.toString());
});

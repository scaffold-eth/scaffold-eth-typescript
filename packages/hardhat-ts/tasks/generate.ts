/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';

import { task } from 'hardhat/config';

import { DEBUG } from '../hardhat.config';

import { mnemonicPath } from './functions/mnemonic';

task('generate', 'Create a mnemonic for builder deploys', async (_, _hre) => {
  const bip39 = require('bip39');
  const hdkey = require('ethereumjs-wallet/hdkey');
  const mnemonic = bip39.generateMnemonic();
  if (DEBUG) console.log('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  if (DEBUG) console.log('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdPath + accountIndex.toString();
  if (DEBUG) console.log('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet._privKey.toString('hex')}`;
  if (DEBUG) console.log('privateKey', privateKey);
  const EthUtil = require('ethereumjs-util');
  const address = `0x${EthUtil.privateToAddress(wallet._privKey).toString('hex')}`;
  console.log(`🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`);
  console.log("💬 Use 'yarn run account' to get more information about the deployment account.");

  fs.writeFileSync(`./generated/${address}.secret`, mnemonic.toString());
  fs.writeFileSync(mnemonicPath, mnemonic.toString());
});

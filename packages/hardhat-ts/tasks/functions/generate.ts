/* eslint-disable @typescript-eslint/restrict-template-expressions */

import fs from 'fs';

import { mnemonicToSeed, generateMnemonic } from 'bip39';
import { privateToAddress } from 'ethereumjs-util';
import { hdkey } from 'ethereumjs-wallet';
import { task } from 'hardhat/config';
import { debugLog } from 'tasks/functions/debug';

import { mnemonicPath } from './mnemonic';

task('generate', 'Create a mnemonic for builder deploys', async (_, _hre) => {
  const mnemonic = generateMnemonic();
  debugLog('mnemonic', mnemonic);
  const seed = await mnemonicToSeed(mnemonic);
  debugLog('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdPath + accountIndex.toString();
  debugLog('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet.getPrivateKey().toString('hex')}`;
  debugLog('privateKey', privateKey);
  const address = `0x${privateToAddress(wallet.getPrivateKey()).toString('hex')}`;
  console.log(`🔐 Account Generated as ${address} and set as mnemonic in packages/hardhat`);
  console.log("💬 Use 'yarn account' to get more information about the deployment account.");

  fs.writeFileSync(`./generated/${address}.secret`, mnemonic.toString());
  fs.writeFileSync(mnemonicPath, mnemonic.toString());
});

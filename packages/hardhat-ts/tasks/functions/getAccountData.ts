import { Wallet } from 'ethers';

const DEBUG = false;

export const getAccountData = async (mnemonic: string): Promise<{ address: string; wallet: Wallet }> => {
  const hdkey = require('ethereumjs-wallet/hdkey');
  const bip39 = require('bip39');
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

  return { address, wallet: Wallet.fromMnemonic(mnemonic, fullPath) };
};

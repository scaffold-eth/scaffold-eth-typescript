import { isAddress, getAddress } from '@ethersproject/address';
import bip39 from 'bip39';
import EthUtil from 'ethereumjs-util';
import { hdkey } from 'ethereumjs-wallet';
import { Wallet } from 'ethers';
import { THardhatDeployEthers } from 'helpers/types/hardhat-type-extensions';
import { debugLog } from 'tasks/helpers/debug';

export const getAccountData = async (mnemonic: string): Promise<{ address: string; wallet: Wallet }> => {
  debugLog('mnemonic', mnemonic);
  const seed = await bip39.mnemonicToSeed(mnemonic);
  debugLog('seed', seed);
  const hdwallet = hdkey.fromMasterSeed(seed);
  const walletHdPath = "m/44'/60'/0'/0/";
  const accountIndex = 0;
  const fullPath = walletHdPath + accountIndex.toString();
  debugLog('fullPath', fullPath);
  const wallet = hdwallet.derivePath(fullPath).getWallet();
  const privateKey = `0x${wallet.getPrivateKey().toString('hex')}`;
  debugLog('privateKey', privateKey);
  const address = `0x${EthUtil.privateToAddress(wallet.getPrivateKey()).toString('hex')}`;

  return { address, wallet: Wallet.fromMnemonic(mnemonic, fullPath) };
};
export const findFirstAddr = async (ethers: THardhatDeployEthers, addr: string): Promise<string> => {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await ethers.provider.listAccounts();
  if (accounts !== undefined) {
    const temp: string | undefined = accounts.find((f: string) => f === addr);
    if (temp != null && ethers.utils.isAddress(temp)) return temp[0];
  }
  throw new Error(`Could not normalize address: ${addr}`);
};

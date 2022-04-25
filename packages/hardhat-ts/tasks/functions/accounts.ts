import { isAddress, getAddress } from '@ethersproject/address';
import { mnemonicToSeed } from 'bip39';
import { privateToAddress } from 'ethereumjs-util';
import { hdkey } from 'ethereumjs-wallet';
import { ethers, Wallet } from 'ethers';
import { keccak256, randomBytes } from 'ethers/lib/utils';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { THardhatRuntimeEnvironmentExtended } from 'helpers/types/THardhatRuntimeEnvironmentExtended';
import { debugLog } from 'tasks/functions/debug';

export const getAccountData = async (mnemonic: string): Promise<{ address: string; wallet: Wallet }> => {
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

  return { address, wallet: Wallet.fromMnemonic(mnemonic, fullPath) };
};
export const findFirstAddress = async (hre: THardhatRuntimeEnvironmentExtended, addr: string): Promise<string> => {
  if (isAddress(addr)) {
    return getAddress(addr);
  }
  const accounts = await hre.ethers.provider.listAccounts();
  if (accounts !== undefined) {
    const temp: string | undefined = accounts.find((f: string) => f === addr);
    if (temp != null && hre.ethers.utils.isAddress(temp)) return temp[0];
  }
  throw new Error(`Could not normalize address: ${addr}`);
};

export const createAddress = (from: string, initCode: string): { address: string; from: string; salt: Uint8Array; initCodeHash: string; initCode: string } => {
  const salt = randomBytes(32);
  const initCodeHash = keccak256(initCode);

  const address = ethers.utils.getCreate2Address(from, salt, initCodeHash);
  return { address, from, salt, initCodeHash, initCode };
};

export interface THardhatAccounts {
  deployer: SignerWithAddress;
  user1: SignerWithAddress;
  user2: SignerWithAddress;
  user3: SignerWithAddress;
  user4: SignerWithAddress;
  user5: SignerWithAddress;
  governance: SignerWithAddress;
}

export const getHardhatSigners = async (hre: THardhatRuntimeEnvironmentExtended): Promise<THardhatAccounts> => {
  const accounts = await hre.getNamedAccounts();

  return {
    deployer: await hre.ethers.getSigner(accounts.deployer),
    user1: await hre.ethers.getSigner(accounts.user1),
    user2: await hre.ethers.getSigner(accounts.user2),
    user3: await hre.ethers.getSigner(accounts.user3),
    user4: await hre.ethers.getSigner(accounts.user4),
    user5: await hre.ethers.getSigner(accounts.user5),
    governance: await hre.ethers.getSigner(accounts.governance),
  };
};

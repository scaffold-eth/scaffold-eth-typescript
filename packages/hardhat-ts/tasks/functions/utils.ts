/* eslint-disable @typescript-eslint/restrict-template-expressions */
import '@nomiclabs/hardhat-ethers';
import fs from 'fs';

import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ContractTransaction } from 'ethers';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export enum ProtocolState {
  Unpaused,
  PublishingPaused,
  Paused,
}

export function getAddrs(): any {
  const json = fs.readFileSync('addresses.json', 'utf8');
  const addrs = JSON.parse(json);
  return addrs;
}

export async function waitForTx(tx: Promise<ContractTransaction>): Promise<void> {
  await (await tx).wait();
}

// export async function deployContract(tx: Promise<ContractTransaction>): Promise<Contract> {
//   const result = await tx;
//   await result.deployTransaction.wait();
//   return result;
// }

// export async function deployWithVerify(
//   hre: HardhatRuntimeEnvironmentExtended,
//   tx: Promise<ContractTransaction>,
//   args: any,
//   contractPath: string
// ): Promise<Contract> {
//   const deployedContract = await deployContract(tx);
//   let count = 0;
//   const maxTries = 8;
//   while (true) {
//     await delay(10000);
//     try {
//       console.log('Verifying contract at', deployedContract.address);
//       await hre.run('verify:verify', {
//         address: deployedContract.address,
//         constructorArguments: args,
//         contract: contractPath,
//       });
//       break;
//     } catch (error) {
//       if (String(error).includes('Already Verified')) {
//         console.log(`Already verified contract at at ${contractPath} at address ${deployedContract.address}`);
//         break;
//       }
//       if (++count == maxTries) {
//         console.log(`Failed to verify contract at ${contractPath} at address ${deployedContract.address}, error: ${error}`);
//         break;
//       }
//       console.log(`Retrying... Retry #${count}, last error: ${error as string}`);
//     }
//   }

//   return deployedContract;
// }

export async function initEnv(hre: HardhatRuntimeEnvironment): Promise<SignerWithAddress[]> {
  const ethers = hre.ethers; // This allows us to access the hre (Hardhat runtime environment)'s injected ethers instance easily

  // const myAccount = await getAccountData(getMnemonic());
  // const signer = await SignerWithAddress.create(myAccount.signer);

  const accounts = await ethers.getSigners(); // This returns an array of the default signers connected to the hre's ethers instance
  const governance = accounts[1];
  const treasury = accounts[2];
  const user = accounts[3];

  return [governance, treasury, user, accounts[4], accounts[5], accounts[6], accounts[7]];
}

export async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

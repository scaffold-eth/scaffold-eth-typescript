import { HardhatEthersHelpers } from '@nomiclabs/hardhat-ethers/dist/src/types';
import { ethers } from 'ethers';

import '@typechain/hardhat';
import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-ethers';
import '@tenderly/hardhat-tenderly';
import 'hardhat-deploy';

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import 'hardhat-deploy/src/type-extensions';

// export type ContractJson = {
//   _format: string;
//   contractName: string;
//   abi: Record<string, object>[];
//   bytecode: string;
//   deployedBytecode: string;
//   linkReferences: Record<string, object>;
//   deployedLinkReferences: Record<string, object>;
//   address: string;
// };

export type { HardhatRuntimeEnvironment as HardhatRuntimeEnvironmentExtended };

export type TEthers = typeof ethers & HardhatEthersHelpers;

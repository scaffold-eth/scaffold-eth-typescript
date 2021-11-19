import { TContractLoaderConfig, TDeployedContractsJson, TExternalContracts } from 'eth-hooks/models';
import { ContractFactory, ethers } from 'ethers';
//import type {YourContract} from "../generated/contract-types";
// this import allows hot module reload to work

const contractListJsonPromise = import('../generated/contracts/hardhat_contracts.json');

/**
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 */
const externalContractsPromise = import('../generated/contracts/external_contracts');

/**
 * LoadsAppContracts
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 * - called  by useAppContracts
 * @returns
 */
export const loadAppContractsConfig = async (): Promise<TContractLoaderConfig> => {
  const config: TContractLoaderConfig = {};

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.deployedContractsJson = ((await contractListJsonPromise).default ?? {}) as unknown as TDeployedContractsJson;
  } catch {
    config.deployedContractsJson = undefined;
    console.error(
      '😶 No deployed contracts file found: /generated/contracts/hardhat_contracts.json, please run hardhat compile & deploy!'
    );
  }

  try {
    config.externalContracts = ((await externalContractsPromise).default ?? {}) as unknown as TExternalContracts;
  } catch {
    config.externalContracts = undefined;
    console.error('😶 No external contracts file found: /generated/contracts/external_contracts');
  }
  return config;
};

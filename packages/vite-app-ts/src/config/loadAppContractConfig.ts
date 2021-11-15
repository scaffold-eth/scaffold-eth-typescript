import { Provider } from '@ethersproject/abstract-provider';
import { createContractConnector, TDeployedContractsJson, TExternalContracts } from 'eth-hooks/models';
import { TContractConfig } from 'eth-hooks/models';
import { BaseContract, Contract, ContractFactory, ContractInterface, ethers, Signer } from 'ethers';
import { Greeter__factory, YourContract, YourContract__factory } from '~~/generated/contract-types';

const contractListJsonPromise = import('../generated/contracts/hardhat_contracts.json');

/**
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 */
const externalContractsPromise = import('../generated/contracts/external_contracts');

export const appContractFactory = {
  YourContract: createContractConnector(YourContract__factory),
  Greeter: createContractConnector(Greeter__factory),
};

/**
 * LoadsAppContracts
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 * - called  by useAppContracts
 * @returns
 */
export const loadAppContracts = async (): Promise<TContractConfig> => {
  const config: TContractConfig = {};

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

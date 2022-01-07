import { contractConnectorConfig, TAppConnectorList } from '~~/config/contractConnectorConfig';
import { TTypedContract } from 'eth-hooks/models';
import { contractsContextFactory, useEthersContext } from 'eth-hooks/context';

/**
 * This file initalises the contractContextFactory and exports the types
 * You don't need to change this file.
 */

/**
 * A type which is composed of contracts (contractNames) in your app
 */
export type TAppContractNames = keyof TAppConnectorList;
/**
 * A generic with 'contractName' that provides the appropriate type for your contract
 */
export type TAppContractTypes<GContractName extends TAppContractNames> = TTypedContract<
  GContractName,
  TAppConnectorList
>;

export const {
  ContractsAppContext,
  useAppContractsActions,
  useAppContractsContext,
  useLoadAppContracts,
  useConnectAppContracts,
} = contractsContextFactory<TAppContractNames, TAppConnectorList, TAppContractTypes<TAppContractNames>>(
  contractConnectorConfig
);

/**
 * Wraps useAppContractsContext to provide narrowly typed contracts for app contracts
 * @param contractName
 * @param chainId
 * @returns
 */
export const useAppContracts = <GContractName extends TAppContractNames>(
  contractName: GContractName,
  chainId: number | undefined
): TAppContractTypes<GContractName> | undefined => {
  const result = useAppContractsContext(contractName, chainId);
  return result as TAppContractTypes<GContractName>;
};

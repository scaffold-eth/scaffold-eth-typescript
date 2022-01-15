import { contractConnectorConfig, TAppConnectorList } from '~~/config/contractConnectorConfig';
import { TAppContractsContext, TTypedContract } from 'eth-hooks/models';
import { contractsContextFactory, useEthersContext } from 'eth-hooks/context';

/**
 * This file initalises the contractContextFactory and exports the types
 * 🙅🏽‍♂️ You don't need to change this file.
 */

/**
 * #### Summary
 * Call contractContextFactory with the contractConnectorConfig.
 * This will create your Context and hooks.
 */
export const {
  ContractsAppContext,
  useAppContractsActions,
  useAppContractsContext,
  useLoadAppContracts,
  useConnectAppContracts,
} = contractsContextFactory<
  keyof TAppConnectorList,
  TAppConnectorList,
  TTypedContract<keyof TAppConnectorList, TAppConnectorList>
>(contractConnectorConfig);

/**
 * Wraps useAppContractsContext to provide narrowly typed contracts for app contracts
 * @param contractName
 * @param chainId
 * @returns
 */
export const useAppContracts = <GContractName extends keyof TAppConnectorList>(
  contractName: GContractName,
  chainId: number | undefined
): TTypedContract<GContractName, TAppConnectorList> | undefined => {
  const result = useAppContractsContext(contractName, chainId);
  return result as TTypedContract<GContractName, TAppConnectorList>;
};

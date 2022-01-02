import { contractConnectorConfig, TAppConnectorList } from '~~/config/contractConnectorConfig';
import { TTypedContract } from 'eth-hooks/models';
import { contractsContextFactory, useEthersContext } from 'eth-hooks/context';

export type TAppContractNames = keyof TAppConnectorList;
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

export const useAppContracts = <GContractName extends TAppContractNames>(
  contractName: GContractName,
  chainId: number | undefined
): TAppContractTypes<GContractName> | undefined => {
  const result = useAppContractsContext(contractName, chainId);
  return result as TAppContractTypes<GContractName>;
};

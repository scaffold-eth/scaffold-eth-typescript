import { DAI } from '~~/generated/external-contracts/types';
import { useCallback, useEffect } from 'react';
import { YourContract } from '~~/generated/contract-types/YourContract';
import { BaseContract } from 'ethers';
import { loadAppContractConnectors, TAppConnectorList } from '~~/config/loadAppContractConnectors';
import { TTypedContract } from 'eth-hooks/models';
import { contractsContextFactory, useEthersContext } from 'eth-hooks/context';
import input from 'antd/lib/input';

export type TAppContractNames = keyof TAppConnectorList;
export type TAppContractTypes<GContractName extends TAppContractNames> = TTypedContract<
  GContractName,
  TAppConnectorList
>;

export const { ContractsAppContext, useAppContractsActions, useAppContractsContext, useLoadAppContracts } =
  contractsContextFactory<TAppContractNames, TAppConnectorList, TAppContractTypes<TAppContractNames>>(
    loadAppContractConnectors
  );

export const useAppContracts = <GContractName extends TAppContractNames>(
  contractName: GContractName,
  chainId: number | undefined
): TAppContractTypes<GContractName> | undefined => {
  if (chainId == undefined) return undefined;

  const result = useAppContractsContext(contractName, chainId);
  return result as TAppContractTypes<GContractName>;
};

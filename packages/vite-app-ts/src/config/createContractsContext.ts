import { DAI } from '~~/generated/external-contracts/types';
import { SFCElement } from 'react';
import { YourContract } from '~~/generated/contract-types/YourContract';
import { BaseContract } from 'ethers';
import { TAppContractConnectors } from '~~/config/contractsLoadConnectors';
import { contractsAppContextFactory } from 'eth-hooks/context';

export type TAppContractNames = keyof TAppContractConnectors;
// export type TAppContractConnectorTypes<GContractNames extends TAppContractNames> =
//   TAppContractConnectorList[GContractNames];
export type TAppContractTypes<GContractName extends TAppContractNames> = <
  GContractName,
  TAppContractConnectorList
>;

export const { ContractsAppContext, useContractsAppActions, useContractsAppContext } = contractsAppContextFactory<
  TAppContractNames,
  TAppContractConnectors,
  TAppContractTypes<TAppContractNames>
>();

const useMoo = <GName extends TAppContractNames>(contractName: GName): TAppContractTypes<GName> => {
  const data = useGetContract(contractName, 1);
  return data as TAppContractTypes<GName>;
};

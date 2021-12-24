import { TContractTypes } from 'eth-hooks/models';
import { contractAppContextFactory } from 'eth-hooks/context';
import {
  loadAppContractConnectors,
  TAppContractConnectorList,
  TAppContractNames,
  TAppContractTypes,
} from '~~/config/contracts/loadAppContractConnectors';
import { DAI } from '~~/generated/external-contracts/types';
import { SFCElement } from 'react';
import { YourContract } from '~~/generated/contract-types/YourContract';

export const {
  ContractsContext,
  ContractsDispatchContext,
  ContractsStateContext,
  useContractsDispatchContext,
  useGetContract,
} = contractAppContextFactory<
  TAppContractNames,
  TAppContractConnectorList,
  TContractTypes<TAppContractNames, TAppContractConnectorList>
>();

const bbb = useGetContract<YourContract>('YourContract', 1);
bbb.jljlkj;

const useMoo = <GG extends TAppContractNames>(contractName: GG): TAppContractTypes<GG> => {
  const data = useGetContract(contractName, 1);
  return data as TAppContractTypes<GG>;
};

const data = useMoo('DAI');
data.();

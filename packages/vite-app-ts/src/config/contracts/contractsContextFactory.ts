import { TContractTypes } from 'eth-hooks/models';
import { contractAppContextFactory } from 'eth-hooks/context';
import { loadAppContractConnectors, TAppContractConnectorList } from '~~/config/contracts/loadAppContractConnectors';
import { DAI } from '~~/generated/external-contracts/types';
import { SFCElement } from 'react';
import { YourContract } from '~~/generated/contract-types/YourContract';
import { BaseContract } from 'ethers';

export type TAppContractNames = keyof TAppContractConnectorList;
// export type TAppContractConnectorTypes<GContractNames extends TAppContractNames> =
//   TAppContractConnectorList[GContractNames];
export type TAppContractTypes<GContractName extends TAppContractNames> = TContractTypes<
  GContractName,
  TAppContractConnectorList
>;

export const {
  ContractsContext,
  ContractsDispatchContext,
  ContractsStateContext,
  useContractsDispatchContext,
  useGetContract,
} = contractAppContextFactory<TAppContractNames, TAppContractConnectorList, TAppContractTypes<TAppContractNames>>();

type b = TAppContractConnectorList[keyof TAppContractConnectorList];

export type TContractTypes2<
  GContractNames extends string,
  GAppContractConnectorList
> = GAppContractConnectorList extends {
  [key in GContractNames]: { connect: (address: any, signerOrProvider: any) => infer TypedContract };
}
  ? { key: GContractNames; type: TypedContract }
  : { key: GContractNames; type: BaseContract };

type BB<GName extends TAppContractNames> = TContractTypes2<GName, TAppContractConnectorList>;
type aaa<GName extends TAppContractNames> = { [T in BB<GName> as T['key']]: T['type'] }[GName];

const data: aaa<'DAI'>;
data;

const bbb = useGetContract<YourContract>('YourContract', 1);

const useMoo = <GName extends TAppContractNames>(contractName: GName): TAppContractTypes<GName> => {
  const data = useGetContract(contractName, 1);
  return data as TAppContractTypes<GName>;
};

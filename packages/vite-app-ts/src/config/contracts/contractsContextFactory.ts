import { contractContextFactory } from 'eth-hooks/context';
import {
  TAppContractConnectorList,
  TAppContractNames,
  TAppContractTypes,
} from '~~/config/contracts/loadAppContractConnectors';

export const {
  ContractsContext,
  ContractsDispatchContext,
  ContractsStateContext,
  useContractsDispatchContext,
  useContractsStateContext,
} = contractContextFactory<TAppContractNames, TAppContractConnectorList>();

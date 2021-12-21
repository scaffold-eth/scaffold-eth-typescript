import { contractContextFactory } from 'eth-hooks/context';
import { TAppContractNames } from '~~/config/contracts/loadAppContractConnectors';

export const {
  ContractsContext,
  ContractsDispatchContext,
  ContractsStateContext,
  useContractsDispatchContext,
  useContractsStateContext,
} = contractContextFactory<TAppContractNames>();

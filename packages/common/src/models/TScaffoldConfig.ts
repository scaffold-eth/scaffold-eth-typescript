import { TNetworkNames } from './TNetworkNames';

export const EtherumToolkits = ['hardhat', 'foundry'] as const;

export type TScaffoldConfig = {
  ethereumToolkit: typeof EtherumToolkits[number];
  targetEnvironment: TNetworkNames[];
};

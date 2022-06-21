import { TNetworkNames } from '.';

export type TScaffoldConfig = {
  ethereumToolkit: 'hardhat' | 'foundry';
  targetEnvironment: TNetworkNames[];
};

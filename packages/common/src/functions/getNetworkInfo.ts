import { getNetwork } from '@ethersproject/networks';

import { networkDefinitions, TNetworkDefinition } from '~common/constants';
import { TNetworkNamesList } from '~common/models';

export const getNetworkInfo = (chainId: number | undefined): TNetworkDefinition | undefined => {
  if (!chainId) return;

  for (const n in networkDefinitions) {
    const names = n as TNetworkNamesList;
    if (networkDefinitions[names].chainId === chainId) {
      return networkDefinitions[names];
    }
  }

  const network = getNetwork(chainId) ?? {};
  // @ts-expect-error
  const rpcUrl: string = network?._defaultProvider?.connection?.rpcUrl ?? '';
  return { ...network, blockExplorer: '', color: '#666666', rpcUrl };
};

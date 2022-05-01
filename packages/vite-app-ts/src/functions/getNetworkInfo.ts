import { getNetwork } from '@ethersproject/networks';
import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { TNetworkNames } from '@scaffold-eth/common/src/models/TNetworkNames';
import { TNetworkInfo } from 'eth-hooks/models';

export const getNetworkInfo = (chainId: number | undefined): TNetworkInfo | undefined => {
  if (!chainId) return;

  for (const n in NETWORKS) {
    const names = n as TNetworkNames;
    if (NETWORKS[names].chainId === chainId) {
      return NETWORKS[names];
    }
  }

  const network = getNetwork(chainId) ?? {};
  // @ts-expect-error
  const url = network?._defaultProvider?.connection?.url ?? '';
  return { ...network, blockExplorer: '', color: '#666666', url: url };
};

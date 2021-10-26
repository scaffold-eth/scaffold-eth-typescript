import { Provider } from '@ethersproject/abstract-provider';
import { getNetwork } from '@ethersproject/networks';
import { BaseProvider } from '@ethersproject/providers';

import { TNetworkInfo } from '~~/models/NetworkTypes';
import { NETWORKS, TNetworkNames } from '../models/constants/networks';

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
  return { ...network, blockExplorer: '', color: '#666666', rpcUrl: url };
};

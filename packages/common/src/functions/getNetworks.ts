import { TNetworkInfo } from 'eth-hooks/models';

import { networkDefinitions, TNetworkDefinition } from '~common/constants';
import { TNetworkNamesList } from '~common/models';

export const getNetworks = (additionalFields: Record<string, any>): Record<string, TNetworkInfo | any> => {
  const result: Record<TNetworkNamesList, TNetworkDefinition | any> = { ...networkDefinitions };
  for (const n in networkDefinitions) {
    const name = n as TNetworkNamesList;
    result[name] = { url: networkDefinitions[name].rpcUrl, ...networkDefinitions[name], ...additionalFields };
  }

  return result;
};

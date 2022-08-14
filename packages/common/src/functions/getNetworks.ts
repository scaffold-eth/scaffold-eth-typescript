import { TNetworkInfo } from 'eth-hooks/models';

import { networkDefinitions } from '~common/constants';
import { TNetworkNamesList } from '~common/models';

export const getNetworks = (additionalFields: Record<string, any>): Record<string, TNetworkInfo | any> => {
  const result: Record<TNetworkNamesList, TNetworkInfo | any> = { ...networkDefinitions };
  for (const n in networkDefinitions) {
    const names = n as TNetworkNamesList;
    result[names] = { ...networkDefinitions[names], ...additionalFields };
  }

  return result;
};

import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider } from 'eth-hooks/models';

import { TNetworkDefinition } from '~common/constants';

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  currentTargetNetwork: TNetworkDefinition;
  targetNetworks: { [chainId: number]: TNetworkDefinition };
  mainnetAdaptor: TEthersAdaptor | undefined;
  localAdaptor: TEthersAdaptor | undefined;
  createLoginConnector: TCreateEthersModalConnector;
}

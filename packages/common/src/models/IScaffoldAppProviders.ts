import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider, TNetworkInfo } from 'eth-hooks/models';

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  currentTargetNetwork: TNetworkInfo;
  targetNetworks: { [chainId: number]: TNetworkInfo };
  mainnetAdaptor: TEthersAdaptor | undefined;
  localAdaptor: TEthersAdaptor | undefined;
  createLoginConnector: TCreateEthersModalConnector;
}

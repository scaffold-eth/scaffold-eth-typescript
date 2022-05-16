import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider, TNetworkInfo } from 'eth-hooks/models';

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  mainnetAdaptor: TEthersAdaptor | undefined;
  localAdaptor: TEthersAdaptor | undefined;
  createLoginConnector: TCreateEthersModalConnector;
}

import { useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { EthersModalConnector, TEthersModalConnector, useEthersAppContext } from 'eth-hooks/context';
import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { useCallback, useEffect } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import { useGetWeb3ModalConfig } from '~common/components/web3-modal/hooks/useGetWeb3ModalConfig';
import { web3ModalConfigKeys } from '~common/config/web3Modal.config';
import {
  MAINNET_PROVIDER,
  LOCAL_PROVIDER,
  CONNECT_TO_BURNER_AUTOMATICALLY,
  TARGET_NETWORK_INFO,
} from '~~/config/app.config';

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  mainnetAdaptor: TEthersAdaptor | undefined;
  localAdaptor: TEthersAdaptor | undefined;
  createLoginConnector: TCreateEthersModalConnector;
}

export const useScaffoldProviders = (): IScaffoldAppProviders => {
  const ethersAppContext = useEthersAppContext();
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  const [localAdaptor] = useEthersAdaptorFromProviderOrSigners(LOCAL_PROVIDER);

  const web3Config = useGetWeb3ModalConfig();

  const { currentTheme } = useThemeSwitcher();

  const createLoginConnector: TCreateEthersModalConnector = useCallback(
    (id?: string) => {
      if (web3Config) {
        const connector = new EthersModalConnector(
          { ...web3Config, theme: currentTheme },
          { reloadOnNetworkChange: false, immutableProvider: false },
          id
        );
        return connector;
      }
    },
    [web3Config, currentTheme]
  );

  useEffect(() => {
    /**
     * This is for to auto connect to the burner wallet when there is no cached provier
     * you can turn it off by settting {@link const_ConnectToBurnerOnFirstLoad} to false
     * @param connector
     * @returns
     */
    const autoConnectToBurner = (connector: TEthersModalConnector | undefined): TEthersModalConnector | undefined => {
      let newConnector = connector;
      if (CONNECT_TO_BURNER_AUTOMATICALLY && connector && connector?.loadWeb3Modal) {
        connector.loadWeb3Modal();
        if (connector != null && !connector.hasCachedProvider()) {
          newConnector = new EthersModalConnector(
            { ...web3Config, theme: currentTheme },
            { reloadOnNetworkChange: false, immutableProvider: false },
            web3ModalConfigKeys.localhostKey
          );
        }
      }
      return newConnector;
    };

    if (!ethersAppContext.active && createLoginConnector) {
      let connector = createLoginConnector(undefined);
      connector = autoConnectToBurner(connector);
      if (connector) void ethersAppContext.activate(connector);
    }
  }, [web3Config]);

  return {
    currentProvider: ethersAppContext.provider ?? LOCAL_PROVIDER,
    mainnetAdaptor: mainnetAdaptor,
    localAdaptor: localAdaptor,
    targetNetwork: TARGET_NETWORK_INFO,
    createLoginConnector: createLoginConnector,
  };
};

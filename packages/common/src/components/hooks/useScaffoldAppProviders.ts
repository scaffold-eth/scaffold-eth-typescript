import { useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { EthersModalConnector, TEthersModalConnector, useEthersAppContext } from 'eth-hooks/context';
import { TEthersProvider, TEthersProviderOrSigner, TNetworkInfo } from 'eth-hooks/models';
import { useEffect } from 'react';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import { IScaffoldAppProviders } from '../../models/IScaffoldAppProviders';

import { useGetCreateLoginConnector } from '~common/components/hooks/useGetLoginConnector';
import { useGetWeb3ModalConfig } from '~common/components/hooks/useGetWeb3ModalConfig';
import { web3ModalConfigKeys } from '~common/config/web3Modal.config';

export const useScaffoldAppProviders = (config: {
  mainnetProvider: TEthersProviderOrSigner | undefined;
  localProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  connectToBurnerAutomatically: boolean;
}): IScaffoldAppProviders => {
  const ethersAppContext = useEthersAppContext();
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(config.mainnetProvider);
  const [localAdaptor] = useEthersAdaptorFromProviderOrSigners(config.localProvider);

  const hasLocalProvider = config?.localProvider !== undefined;
  const web3Config = useGetWeb3ModalConfig(hasLocalProvider);

  const { currentTheme } = useThemeSwitcher();

  const createLoginConnector = useGetCreateLoginConnector(currentTheme, web3Config);

  useEffect(() => {
    /**
     * This is for to auto connect to the burner wallet when there is no cached provier
     * you can turn it off by settting {@link const_ConnectToBurnerOnFirstLoad} to false
     * @param connector
     * @returns
     */
    const autoConnectToBurner = (connector: TEthersModalConnector | undefined): TEthersModalConnector | undefined => {
      let newConnector = connector;
      if (config.connectToBurnerAutomatically && connector && connector?.loadWeb3Modal) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Config, config.connectToBurnerAutomatically, createLoginConnector]);

  return {
    currentProvider: ethersAppContext.provider ?? config.localProvider,
    mainnetAdaptor: mainnetAdaptor,
    localAdaptor: localAdaptor,
    targetNetwork: config.targetNetwork,
    createLoginConnector: createLoginConnector,
  };
};

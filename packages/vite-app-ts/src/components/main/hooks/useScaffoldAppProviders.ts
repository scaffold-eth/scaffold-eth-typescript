import { StaticJsonRpcProvider } from '@ethersproject/providers';
import input from 'antd/lib/input';
import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ICoreOptions } from 'web3modal';
import { EthersModalConnector, TEthersModalConnector, useEthersContext } from 'eth-hooks/context';
import { useThemeSwitcher } from 'react-css-theme-switcher';

import { useEthersAdaptorFromProviderOrSigners } from 'eth-hooks';
import { web3ModalConfigKeys } from '~~/config/web3ModalConfig';
import invariant from 'ts-invariant';
import {
  MAINNET_PROVIDER,
  LOCAL_PROVIDER,
  CONNECT_TO_BURNER_ON_FIRST_LOAD,
  TARGET_NETWORK_INFO,
} from '~~/config/appConfig';

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  mainnetAdaptor: TEthersAdaptor | undefined;
  localAdaptor: TEthersAdaptor | undefined;
  createLoginConnector: TCreateEthersModalConnector;
}

export const useScaffoldProviders = (): IScaffoldAppProviders => {
  const [web3Config, setWeb3Config] = useState<Partial<ICoreOptions>>();
  const ethersContext = useEthersContext();
  const [mainnetAdaptor] = useEthersAdaptorFromProviderOrSigners(MAINNET_PROVIDER);
  const [localAdaptor] = useEthersAdaptorFromProviderOrSigners(LOCAL_PROVIDER);

  const firstLoadRef = useRef(true);

  useEffect(() => {
    // import async to split bundles
    const importedConfig = import('../../../config/web3ModalConfig');

    importedConfig.then((getter) => {
      getter
        .getWeb3ModalConfig()
        .then((config) => {
          setWeb3Config(config);
        })
        .catch((e) => {
          invariant.error('Web3Modal", "cannot load web3 modal config', e);
        });
    });
  }, []);

  const { currentTheme } = useThemeSwitcher();

  const createLoginConnector: TCreateEthersModalConnector = useCallback(
    (id?: string) => {
      if (web3Config) {
        let connector = new EthersModalConnector(
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
    const autoConnectToBurner = (connector: TEthersModalConnector | undefined) => {
      if (CONNECT_TO_BURNER_ON_FIRST_LOAD && connector) {
        (connector as EthersModalConnector).loadCore();
        if (connector != null && !connector.hasCachedProvider()) {
          connector = new EthersModalConnector(
            { ...web3Config, theme: currentTheme },
            { reloadOnNetworkChange: false, immutableProvider: false },
            web3ModalConfigKeys.localhostKey
          );
        }
      }
      return connector;
    };

    if (!ethersContext.active && createLoginConnector) {
      let connector = createLoginConnector(undefined);
      connector = autoConnectToBurner(connector);
      if (connector) ethersContext.activate(connector);
    }
  }, [web3Config]);

  return {
    currentProvider: ethersContext.provider ?? LOCAL_PROVIDER,
    mainnetAdaptor: mainnetAdaptor,
    localAdaptor: localAdaptor,
    targetNetwork: TARGET_NETWORK_INFO,
    createLoginConnector: createLoginConnector,
  };
};

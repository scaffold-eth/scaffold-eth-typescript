import { StaticJsonRpcProvider } from '@ethersproject/providers';
import input from 'antd/lib/input';
import { TCreateEthersModalConnector, TEthersAdaptor, TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ICoreOptions } from 'web3modal';
import { EthersModalConnector, useEthersContext } from 'eth-hooks/context';
import { useThemeSwitcher } from 'react-css-theme-switcher';
import { mainnetProvider, localProvider, targetNetworkInfo } from '~~/config/providersConfig';
import { useGetEthersAdaptorFromProviders } from 'eth-hooks';

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
  const mainnetAdaptor = useGetEthersAdaptorFromProviders(mainnetProvider);
  const localAdaptor = useGetEthersAdaptorFromProviders(localProvider);

  useEffect(() => {
    // import async to split bundles
    const importedConfig = import('../../../config/web3ModalConfig');

    importedConfig.then((getter) => {
      getter.getWeb3ModalConfig().then((config) => {
        setWeb3Config(config);
      });
    });
  }, []);

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
    if (!ethersContext.active && createLoginConnector) {
      const connector = createLoginConnector();
      if (connector) ethersContext.activate(connector);
    }
  }, [web3Config]);

  return {
    currentProvider: ethersContext.provider ?? localProvider,
    mainnetAdaptor: mainnetAdaptor,
    localAdaptor: localAdaptor,
    targetNetwork: targetNetworkInfo,
    createLoginConnector: createLoginConnector,
  };
};

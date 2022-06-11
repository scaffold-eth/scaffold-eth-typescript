import { EthersModalConnector } from 'eth-hooks/context';
import { TCreateEthersModalConnector } from 'eth-hooks/models';
import { useCallback } from 'react';
import { ICoreOptions } from 'web3modal';

export const useGetCreateLoginConnector = (
  currentTheme: string | undefined,
  web3Config: Partial<ICoreOptions> | undefined
): TCreateEthersModalConnector => {
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

  return createLoginConnector;
};

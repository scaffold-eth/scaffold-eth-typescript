import { useBurnerSigner } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useEffect } from 'react';

import { IScaffoldAppProviders } from '../../models/IScaffoldAppProviders';

import { networkDefinitions } from '~common/constants/networkDefinitions';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders, enable: boolean): void => {
  const ethersAppContext = useEthersAppContext();
  const burnerFallback = useBurnerSigner(appProviders.localAdaptor?.provider);
  const localAddress = appProviders.localAdaptor?.signer;

  useEffect(() => {
    const sameUrl =
      ethersAppContext.provider?.connection?.url === networkDefinitions.localhost.rpcUrl ||
      ethersAppContext.provider?.connection?.url ===
        networkDefinitions.localhost.rpcUrl.replace('127.0.0.1', 'localhost');
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (
      burnerFallback?.signer &&
      burnerFallback?.account !== ethersAppContext.account &&
      ethersAppContext.chainId === networkDefinitions.localhost.chainId &&
      sameUrl &&
      ethersAppContext.changeSigner &&
      localAddress != null &&
      enable
    ) {
      void ethersAppContext.changeSigner?.(burnerFallback.signer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    ethersAppContext.account,
    localAddress,
    ethersAppContext.changeSigner,
    burnerFallback.signer,
    burnerFallback?.account,
    enable,
  ]);
};

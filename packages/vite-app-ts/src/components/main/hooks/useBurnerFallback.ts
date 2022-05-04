import { NETWORKS } from '@scaffold-eth/common/src/constants';
import { useBurnerSigner } from 'eth-hooks';
import { useEthersAppContext } from 'eth-hooks/context';
import { useEffect } from 'react';

import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders, enable: boolean): void => {
  const ethersAppContext = useEthersAppContext();
  const burnerFallback = useBurnerSigner(appProviders.localAdaptor?.provider);
  const localAddress = appProviders.localAdaptor?.signer;

  useEffect(() => {
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (
      burnerFallback?.signer &&
      burnerFallback?.account !== ethersAppContext.account &&
      ethersAppContext.chainId === NETWORKS.localhost.chainId &&
      ethersAppContext.provider?.connection?.url === NETWORKS.localhost.url &&
      ethersAppContext.changeSigner &&
      localAddress != null &&
      enable
    ) {
      void ethersAppContext.changeSigner?.(burnerFallback.signer);
    }
  }, [
    ethersAppContext.account,
    localAddress,
    ethersAppContext.changeSigner,
    burnerFallback.signer,
    burnerFallback?.account,
    ethersAppContext,
    enable,
  ]);
};

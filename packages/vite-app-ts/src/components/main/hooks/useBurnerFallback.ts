import { useEthersContext } from 'eth-hooks/context';
import { useBurnerSigner, useSignerAddress } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider } from 'eth-hooks/models';
import { useEffect, useRef, useState } from 'react';
import { IScaffoldAppProviders } from '~~/components/main/hooks/useScaffoldAppProviders';

import { localNetworkInfo } from '~~/config/providersConfig';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders, enable: boolean) => {
  const ethersContext = useEthersContext();
  const burnerFallback = useBurnerSigner(appProviders.localAdaptor?.provider);
  const localAddress = appProviders.localAdaptor?.signer;

  useEffect(() => {
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (
      burnerFallback.account != ethersContext.account &&
      ethersContext.chainId == localNetworkInfo.chainId &&
      ethersContext.provider?.connection.url === localNetworkInfo.rpcUrl &&
      burnerFallback.signer &&
      enable
    ) {
      ethersContext.changeSigner?.(burnerFallback.signer);
    }
  }, [ethersContext.account, localAddress, ethersContext.changeSigner, burnerFallback.signer]);
};

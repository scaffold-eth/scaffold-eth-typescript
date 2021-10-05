import { useEthersContext } from 'eth-hooks/context';
import { useBurnerSigner, useGetUserFromProviders, useGetUserFromSigners } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider } from 'eth-hooks/models';
import { useEffect, useRef, useState } from 'react';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import input from 'antd/lib/input';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders) => {
  const ethersContext = useEthersContext();
  const burnerFallback = useBurnerSigner(appProviders.localProvider as TEthersProvider);

  useEffect(() => {
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (
      ethersContext.chainId === appProviders.localProvider?.network?.chainId &&
      ethersContext.ethersProvider?.network?.name === appProviders.localProvider?.network?.name &&
      ethersContext.ethersProvider?.connection.url === appProviders.localProvider.connection.url &&
      appProviders.localProvider?.network != null &&
      burnerFallback.signer != null &&
      burnerFallback.account != null
    ) {
      appProviders.isUsingFallback = true;
      ethersContext.changeAccount?.(burnerFallback.signer);
    } else {
      appProviders.isUsingFallback = false;
    }
  }, [
    ethersContext.chainId,
    ethersContext.ethersProvider,
    appProviders.localProvider,
    burnerFallback.signer,
    burnerFallback.account,
  ]);
};

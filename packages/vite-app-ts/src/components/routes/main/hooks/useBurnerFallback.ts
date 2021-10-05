import { useEthersContext } from 'eth-hooks/context';
import { useBurnerSigner, useGetUserFromProviders, useGetUserFromSigners, useUserAddress } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider } from 'eth-hooks/models';
import { useEffect, useRef, useState } from 'react';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import input from 'antd/lib/input';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders) => {
  const ethersContext = useEthersContext();
  const burnerFallback = useBurnerSigner(appProviders.localProvider as TEthersProvider);
  const localAddress = useUserAddress(appProviders.localProvider.getSigner());

  useEffect(() => {
    /**
     * if the current provider is local provider then use the burner fallback
     */
    if (ethersContext.account === localAddress && burnerFallback.signer) {
      appProviders.isUsingFallback = true;
      ethersContext.changeAccount?.(burnerFallback.signer);
    } else {
      appProviders.isUsingFallback = false;
    }
  }, [ethersContext.account, localAddress, ethersContext.changeAccount, burnerFallback.signer]);
};

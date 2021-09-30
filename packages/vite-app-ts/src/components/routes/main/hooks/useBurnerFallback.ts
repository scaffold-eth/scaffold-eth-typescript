import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'crypto';
import { useBurnerSigner, useGetUserFromProviders, useGetUserFromSigners } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider, TEthersProviderOrSigner, TEthersUser } from 'eth-hooks/models';
import { useRef, useState } from 'react';
import { IScaffoldProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

export const useBurnerFallback = (appProviders: IScaffoldProviders, currentEthersUser: TEthersUser): TEthersUser => {
  const burnerFallback = useBurnerSigner(appProviders.fallbackProvider as TEthersProvider);
  const burnerUser = useGetUserFromSigners(burnerFallback.signer);

  if (
    currentEthersUser.providerNetwork?.chainId === appProviders.fallbackProvider?.network?.chainId &&
    currentEthersUser.provider?.connection.url === appProviders.fallbackProvider.connection.url &&
    appProviders.fallbackProvider?.network != null &&
    burnerUser.signer != null
  ) {
    appProviders.isUsingFallback = true;
    return burnerUser;
  } else {
    return currentEthersUser;
  }
};

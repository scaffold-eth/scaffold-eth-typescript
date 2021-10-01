import { useBurnerSigner, useGetUserFromProviders, useGetUserFromSigners } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider, TEthersProviderOrSigner, TEthersUser } from 'eth-hooks/models';
import { useRef, useState } from 'react';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

export const useBurnerFallback = (appProviders: IScaffoldAppProviders, currentEthersUser: TEthersUser): TEthersUser => {
  const burnerFallback = useBurnerSigner(appProviders.localProvider as TEthersProvider);
  const burnerUser = useGetUserFromSigners(burnerFallback.signer);

  if (
    currentEthersUser.providerNetwork?.chainId === appProviders.localProvider?.network?.chainId &&
    currentEthersUser.providerNetwork?.name === appProviders.localProvider?.network?.name &&
    currentEthersUser.provider?.connection.url === appProviders.localProvider.connection.url &&
    appProviders.localProvider?.network != null &&
    burnerUser.signer != null
  ) {
    appProviders.isUsingFallback = true;
    return burnerUser;
  } else {
    return currentEthersUser;
  }
};

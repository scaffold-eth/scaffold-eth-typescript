import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'crypto';
import { useBurnerSigner, useUserProviderAndSigner } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider, TEthersProviderOrSigner, TProviderAndSigner } from 'eth-hooks/models';
import { useRef, useState } from 'react';

export const useBurnerFallback = (
  providerAndSigner: TProviderAndSigner | undefined
): TProviderAndSigner | undefined => {
  const fallbackSigner = useBurnerSigner(providerAndSigner?.provider as TEthersProvider);
  const input: TEthersProvider[] = fallbackSigner.signer?.provider
    ? [fallbackSigner.signer?.provider as TEthersProvider]
    : [];
  const result = useUserProviderAndSigner(...input);
  const creatingRef = useRef(false);

  if (providerAndSigner?.provider && providerAndSigner?.providerNetwork && providerAndSigner?.signer) {
    return providerAndSigner;
  } else {
    if (!fallbackSigner.signer && !creatingRef.current) {
      creatingRef.current = true;
      fallbackSigner?.createBurnerSigner();
    }

    if (result?.provider && result?.providerNetwork && result?.signer) {
      return result;
    }

    return { signer: undefined, provider: undefined, providerNetwork: undefined, address: undefined };
  }
};

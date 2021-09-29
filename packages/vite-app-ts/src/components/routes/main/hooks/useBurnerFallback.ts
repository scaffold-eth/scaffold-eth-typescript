import { Provider } from '@ethersproject/abstract-provider';
import { Signer } from 'crypto';
import { useBurnerSigner, useUserProviderAndSigner } from 'eth-hooks';
import { parseProviderOrSigner } from 'eth-hooks/functions';
import { TEthersProvider, TEthersProviderOrSigner, TProviderAndSigner } from 'eth-hooks/models';
import { useState } from 'react';

export const useBurnerFallback = (providerAndSigner: TProviderAndSigner | undefined): TProviderAndSigner => {
  const fallbackSigner = useBurnerSigner(providerAndSigner?.provider as TEthersProvider);
  const input: Provider[] = fallbackSigner.signer?.provider ? [fallbackSigner.signer?.provider] : [];
  const result = useUserProviderAndSigner(...input);

  if (providerAndSigner?.provider && providerAndSigner?.providerNetwork && providerAndSigner?.signer) {
    return providerAndSigner;
  } else {
    if (!fallbackSigner.signer) {
      fallbackSigner?.createBurnerSigner();
    }

    if (result?.provider && result?.providerNetwork && result?.signer) {
      return result;
    }

    return { signer: undefined, provider: undefined, providerNetwork: undefined };
  }
};

import '~~/styles/tailwind.css';
import '~~/styles/globals.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { EthComponentsSettingsContext, IEthComponentsSettings } from 'eth-components/models';
import { EthersAppContext } from 'eth-hooks/context';
import type { AppProps } from 'next/app';
import React, { FC, ReactNode, Suspense, useState } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import { ErrorBoundary, ErrorFallback } from '~common/components';
import { BLOCKNATIVE_DAPPID } from '~~/config/app.config';

const cache = createCache({ key: 'next' });

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * 🏹 See ./MainPage.tsx for main app component!
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * This file loads the app async.  It sets up context, error boundaries, styles etc.
 * You don't need to change this file!!
 */

console.log('init app...');

// load saved theme
const savedTheme = 'light';

// setup themes for theme switcher
const themes = {
  dark: './ant-dark-theme.css',
  light: './ant-light-theme.css',
};

// create eth components context for options and API keys
const ethComponentsSettings: IEthComponentsSettings = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

const ProviderWrapper: FC<{ children?: ReactNode }> = (props) => {
  return (
    <EthComponentsSettingsContext.Provider value={ethComponentsSettings}>
      <EthersAppContext disableDefaultQueryClientRoot={true}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme ?? 'light'}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>{props.children}</ErrorBoundary>
          </ThemeSwitcherProvider>
        </ErrorBoundary>
      </EthersAppContext>
    </EthComponentsSettingsContext.Provider>
  );
};

/**
 * ### Summary
 * The main app component is {@see MainPage} `components/routes/main/MaingPage.tsx`
 * This component sets up all the providers, Suspense and Error handling
 * @returns
 */
const App: FC<AppProps> = ({ Component, ...props }) => {
  const [queryClient] = useState(() => new QueryClient());

  console.log('loading app...');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CacheProvider value={cache}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={props.pageProps.dehydratedState}>
            <ProviderWrapper>
              <Suspense fallback={<div />}>
                <Component {...props.pageProps} />
              </Suspense>
            </ProviderWrapper>
          </Hydrate>
        </QueryClientProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
};

export default App;

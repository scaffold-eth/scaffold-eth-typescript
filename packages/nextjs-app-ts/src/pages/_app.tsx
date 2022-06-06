import '~~/styles/globals.css';
import '~~/styles/tailwind.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { EthComponentsSettingsContext, IEthComponentsSettings } from 'eth-components/models';
import { EthersAppContext } from 'eth-hooks/context';
import type { AppProps } from 'next/app';
import React, { FC, useState } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';

import { ErrorBoundary, ErrorFallback } from '~common/components';
import { ContractsAppContext } from '~~/components/contractContext';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

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

const BLOCKNATIVE_DAPPID = process.env.VITE_KEY_BLOCKNATIVE_DAPPID;

// load saved theme
const savedTheme = 'light';

// setup themes for theme switcher
const themes = {
  dark: './dark-theme.css',
  light: './light-theme.css',
};

// create eth components context for options and API keys
const ethComponentsSettings: IEthComponentsSettings = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

/**
 * ### Summary
 * The main app component is {@see MainPage} `components/routes/main/MaingPage.tsx`
 * This component sets up all the providers, Suspense and Error handling
 * @returns
 */
const App: FC<AppProps> = ({ Component, ...props }) => {
  const [queryClient, setQueryClient] = useState(() => new QueryClient());

  console.log('loading app...');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CacheProvider value={cache}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={props.pageProps.dehydratedState}>
            <EthComponentsSettingsContext.Provider value={ethComponentsSettings}>
              <ContractsAppContext>
                <EthersAppContext disableQueryClientRoot={true}>
                  <ErrorBoundary FallbackComponent={ErrorFallback}>
                    <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme ?? 'light'}>
                      <Component {...props.pageProps} />
                    </ThemeSwitcherProvider>
                  </ErrorBoundary>
                </EthersAppContext>
              </ContractsAppContext>
            </EthComponentsSettingsContext.Provider>
          </Hydrate>
        </QueryClientProvider>
      </CacheProvider>
    </ErrorBoundary>
  );
};

export default App;

// import { AppProps } from 'next/app';
// import { FC } from 'react';
// import { useIsMounted } from 'test-usehooks-ts';

// /**
//  * ### Summary
//  * The main app component is {@see MainPage} `components/routes/main/MaingPage.tsx`
//  * This component sets up all the providers, Suspense and Error handling
//  * @returns
//  */
// const App: FC<AppProps> = ({ Component, ...props }) => {
//   const data = useIsMounted();
//   console.log('loading app...');
//   return <Component {...props.pageProps} />;
// };

// export default App;

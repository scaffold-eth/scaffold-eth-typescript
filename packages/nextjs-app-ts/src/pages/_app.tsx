import '~~/styles/tailwind.css';
import '~~/styles/globals.css';

import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { IEthComponentsSettings } from 'eth-components/models';
import type { AppProps } from 'next/app';
import React, { FC, Suspense, useState } from 'react';
import { Hydrate, QueryClient } from 'react-query';

import { ErrorBoundary, ErrorFallback } from '~common/components';
import { AppContexts } from '~common/components/context';

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
  dark: './ant-dark-theme.css',
  light: './ant-light-theme.css',
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
        <AppContexts themes={themes} savedTheme={savedTheme} ethComponentsSettings={ethComponentsSettings}>
          <Hydrate state={props.pageProps.dehydratedState}>
            <Suspense fallback={<div />}>
              <Component {...props.pageProps} />
            </Suspense>
          </Hydrate>
        </AppContexts>
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

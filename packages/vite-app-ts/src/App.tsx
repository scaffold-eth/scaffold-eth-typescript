import '~~/styles/tailwind.css';
import '~~/styles/globals.css';

import { IEthComponentsSettings } from 'eth-components/models';
import { lazier } from 'eth-hooks/helpers';
import React, { FC, Suspense } from 'react';

import { ErrorBoundary, ErrorFallback } from '~common/components';
import { AppContexts } from '~common/components/context';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * 🏹 See ./pages/MainPage.tsx for main app component!
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * This file loads the app async.  It sets up context, error boundaries, styles etc.
 * You don't need to change this file!!
 */

console.log('init app...');

const BLOCKNATIVE_DAPPID = import.meta.env.VITE_KEY_BLOCKNATIVE_DAPPID;

// load saved theme
const savedTheme = window.localStorage.getItem('theme') ?? 'light';

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
 * Lazy load the main app component
 */
const MainPage = lazier(() => import('./pages/MainPage'), 'MainPage');

/**
 * ### Summary
 * The main app component is {@see MainPage} `./pages/MaingPage.tsx`
 * This component sets up all the providers, Suspense and Error handling
 * @returns
 */
const App: FC = () => {
  console.log('loading app...');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppContexts themes={themes} savedTheme={savedTheme} ethComponentsSettings={ethComponentsSettings}>
        <Suspense fallback={<div />}>
          <MainPage></MainPage>
        </Suspense>
      </AppContexts>
    </ErrorBoundary>
  );
};

export default App;

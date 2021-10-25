import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { FC, lazy, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { EthComponentsContext, IEthComponentsContext } from 'eth-components/models';
import { ErrorBoundary, ErrorFallback } from '~~/components/common/ErrorFallback';
import { BLOCKNATIVE_DAPPID } from '~~/models/constants/constants';
import { subgraphUri } from '~~/config/subgraph';
import { EthersAppContext } from 'eth-hooks/context';

console.log('new');
// import postcss style file
import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';

// load saved theme
const savedTheme = window.localStorage.getItem('theme');
//setup themes for theme switcher
const themes = {
  dark: './dark-theme.css',
  light: './light-theme.css',
};

const MainPage = lazy(() => import('./main/MainPage'));

// load graphql client for subgraphs
const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

// create eth components context for options and API keys
const context: IEthComponentsContext = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

const App: FC = () => {
  console.log('app');
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApolloProvider client={client}>
        <EthComponentsContext.Provider value={context}>
          <EthersAppContext>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme || 'light'}>
                <Suspense fallback={<div />}>
                  <MainPage />
                </Suspense>
              </ThemeSwitcherProvider>
            </ErrorBoundary>
          </EthersAppContext>
        </EthComponentsContext.Provider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;

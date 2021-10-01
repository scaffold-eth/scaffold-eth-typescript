import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import React, { FC, lazy, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { EthComponentsContext, IEthComponentsContext } from 'eth-components/models';
import { Web3ReactProvider, useWeb3React } from '@web3-react/core';
import { ErrorBoundary, ErrorFallback } from '~~/components/common/ErrorFallback';
// import { MainPage } from '~~/components/routes/main/MainPage';
import '~~/styles/css/tailwind-base.pcss';
import '~~/styles/css/tailwind-components.pcss';
import '~~/styles/css/tailwind-utilities.pcss';
import '~~/styles/css/app.css';
import { BLOCKNATIVE_DAPPID } from '~~/models/constants/constants';
import { subgraphUri } from '~~/config/subgraph';
import { Web3Provider } from '@ethersproject/providers';
import { EthersWeb3Context } from '.yalc/eth-hooks/context';

const MainPage = lazy(() => import('./main/MainPage'));

function getLibrary(provider: any): any {
  return new Web3Provider(provider);
}

const themes = {
  dark: `${process.env.PUBLIC_URL ?? ''}/dark-theme.css`,
  light: `${process.env.PUBLIC_URL ?? ''}/light-theme.css`,
};

const prevTheme = window.localStorage.getItem('theme');

const client = new ApolloClient({
  uri: subgraphUri,
  cache: new InMemoryCache(),
});

const context: IEthComponentsContext = {
  apiKeys: {
    BlocknativeDappId: BLOCKNATIVE_DAPPID,
  },
};

const App: FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ApolloProvider client={client}>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme || 'light'}>
          <EthComponentsContext.Provider value={context}>
            <EthersWeb3Context>
              <ErrorBoundary FallbackComponent={ErrorFallback}>
                <Suspense fallback={<div />}>
                  <MainPage />
                </Suspense>
              </ErrorBoundary>
            </EthersWeb3Context>
          </EthComponentsContext.Provider>
        </ThemeSwitcherProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;

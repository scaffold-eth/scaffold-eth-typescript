import { EthComponentsSettingsContext, IEthComponentsSettings } from 'eth-components/models';
import { EthersAppContext } from 'eth-hooks/context';
import { FC, ReactElement } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ErrorBoundary } from 'react-error-boundary';

import { ContractsAppContext } from '~common/components/context/contractContext';
import { ErrorFallback } from '~common/components/ErrorFallback';

interface IAppContexts {
  themes: { dark: string; light: string };
  savedTheme: string;
  children: ReactElement;
  ethComponentsSettings: IEthComponentsSettings;
}

export const AppContexts: FC<IAppContexts> = (props) => {
  return (
    <EthComponentsSettingsContext.Provider value={props.ethComponentsSettings}>
      <ContractsAppContext>
        <EthersAppContext>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeSwitcherProvider themeMap={props.themes} defaultTheme={props.savedTheme ?? 'light'}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>{props.children}</ErrorBoundary>
            </ThemeSwitcherProvider>
          </ErrorBoundary>
        </EthersAppContext>
      </ContractsAppContext>
    </EthComponentsSettingsContext.Provider>
  );
};

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
  disableQueryClientRoot?: boolean;
}

export const AppContexts: FC<IAppContexts> = (props) => {
  const element = (
    <EthComponentsSettingsContext.Provider value={props.ethComponentsSettings}>
      <ContractsAppContext>
        <EthersAppContext disableQueryClientRoot={props.disableQueryClientRoot}>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <ThemeSwitcherProvider themeMap={props.themes} defaultTheme={props.savedTheme ?? 'light'}>
              <ErrorBoundary FallbackComponent={ErrorFallback}>{props.children}</ErrorBoundary>
            </ThemeSwitcherProvider>
          </ErrorBoundary>
        </EthersAppContext>
      </ContractsAppContext>
    </EthComponentsSettingsContext.Provider>
  );

  return element;
};

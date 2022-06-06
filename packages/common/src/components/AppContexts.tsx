import { EthersAppContext } from 'eth-hooks/context';
import { FC, ReactElement, Suspense } from 'react';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback } from '~common/components/ErrorFallback';

export const AppContexts: FC<{ children: ReactElement }> = (props) => {
  return (
    <EthersAppContext>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <ThemeSwitcherProvider themeMap={themes} defaultTheme={savedTheme ?? 'light'}>
          <Suspense fallback={<div />}>{props.children}</Suspense>
        </ThemeSwitcherProvider>
      </ErrorBoundary>
    </EthersAppContext>
  );
};

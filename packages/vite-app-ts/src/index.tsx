/* eslint-disable */

import { StrictMode } from 'react';

//import React from 'react';

const run = async (): Promise<void> => {
  // dynamic imports for code splitting
  const { lazy, Suspense, StrictMode } = await import('react');
  const ReactDOM = await import('react-dom');
  await import('./helpers/__global');
  const App = lazy(() => import('./components/routes/App'));

  ReactDOM.render(
    <StrictMode>
      <Suspense fallback={<div />}>
        <App />
      </Suspense>
    </StrictMode>,
    document.getElementById('root')
  );
};

void run();

export {};

/* eslint-disable */

/**
 * Loads {@see App} which sets up the application.
 * The main page is in the component {@see MainPage}
 */
const run = async (): Promise<void> => {
  // dynamic imports for code splitting
  const { lazy, Suspense, StrictMode } = await import('react');
  const ReactDOM = await import('react-dom');
  await import('./helpers/__global');
  const App = lazy(() => import('./app/App'));

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

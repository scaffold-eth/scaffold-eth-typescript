/* eslint-disable */
//import './helpers/__global';

/**
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * 🏹 See ./pages/MainPage.tsx for main app component!
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 *
 * This file loads react.
 * You don't need to change this file!!
 */

/**
 * Loads {@see App} which sets up the application async.
 * The main page is in the component {@see MainPage}
 */
const run = async (): Promise<void> => {
  await import('./helpers/__global');
  // dynamic imports for code splitting
  const { lazy, Suspense, StrictMode } = await import('react');
  const { createRoot } = await import('react-dom/client');
  const ReactDOM = await import('react-dom');
  const App = lazy(() => import('./App'));

  const container = document.getElementById('root');
  const reactRoot = createRoot(container!);
  reactRoot.render(
    <StrictMode>
      <Suspense fallback={<div />}>
        <App />
      </Suspense>
    </StrictMode>
  );
};

void run();

export {};

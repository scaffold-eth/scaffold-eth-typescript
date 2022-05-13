import '~~/styles/globals.css';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import type { AppProps } from 'next/app';
import { FC } from 'react';

const cache = createCache({ key: 'next' });

const MyApp: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <CacheProvider value={cache}>
      <Component {...pageProps} />
    </CacheProvider>
  );
};

export default MyApp;

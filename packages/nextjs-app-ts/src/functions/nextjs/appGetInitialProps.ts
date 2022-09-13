import { AppContext, AppInitialProps } from 'next/app';

export const appGetInitialProps = async ({ Component, ctx }: AppContext): Promise<AppInitialProps> => {
  const pageProps = (await Component.getInitialProps?.({ ...ctx })) ?? {};
  return { pageProps: { ...pageProps, appProps: {} } };
};

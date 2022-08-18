import { loadAppConfig } from '~~/config/app.config';

export type TAppConfig = Awaited<ReturnType<typeof loadAppConfig>>;

export type TAppProps = {
  config: TAppConfig;
};

export type TPageProps = {
  appProps: TAppProps;
};

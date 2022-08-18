// import { loadAppConfig } from '~~/config/app.config';

// export type TAppConfig = Awaited<ReturnType<typeof loadAppConfig>>;

export type TAppProps = {
  config: never;
};

export type TPageProps = {
  appProps: TAppProps;
};

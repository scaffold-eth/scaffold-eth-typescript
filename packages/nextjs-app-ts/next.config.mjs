import { resolve } from 'path';
const __dirname = resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true, emotion: true, externalDir: true, reactRefresh: true, swcFileReading: true },
  swcMinify: true,
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // -------------------------------------------
      // your aliases
      'eth-hooks': resolve(__dirname, './node_modules/eth-hooks'),
      'eth-components': resolve(__dirname, './node_modules/eth-components'),
      'react-css-theme-switcher': resolve(__dirname, './node_modules/react-css-theme-switcher'),
      react: resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
      // -------------------------------------------
    };
    return config;
  },
};

export default nextConfig;

import path from 'path';
const __dirname = path.resolve();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true, emotion: true, externalDir: true, reactRefresh: true, swcFileReading: true },
  swcMinify: true,
  productionBrowserSourceMaps: true,
  webpack: (config, { dev, isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // your aliases
      'eth-hooks': path.resolve(__dirname, './node_modules/eth-hooks'),
      'eth-components': path.resolve(__dirname, './node_modules/eth-components'),
      'react-css-theme-switcher': path.resolve(__dirname, './node_modules/react-css-theme-switcher'),
    };
    return config;
  },
};

export default nextConfig;

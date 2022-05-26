/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: 'loose', emotion: true, externalDir: true },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { esmExternals: true, emotion: true, externalDir: true },
};

module.exports = nextConfig;

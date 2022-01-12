import { defineConfig } from 'vite';
//import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import reactPlugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path, { resolve } from 'path';
import { viteExternalsPlugin } from 'vite-plugin-externals';

const isDev = process.env.ENVIRONMENT == 'DEVELOPMENT';
console.log('env.dev:', process.env.ENVIRONMENT, ' isDev:', isDev);

/**
 * browserify for web3 components
 */
const nodeExternals = {
  util: 'util',
  stream: 'stream-browserify',
  http: 'http-browserify',
  https: 'http-browserify',
  timers: 'timers-browserify',
};

/**
 * Externals:
 * - node externals are required because web3 are terribly bundled and some of them use commonjs libraries.  modern libs like ethers help with this.
 * - electron:  added due to ipfs-http-client.  it has very poor esm compatibility and a ton of dependency bugs. see: https://github.com/ipfs/js-ipfs/issues/3452
 */
const externals = viteExternalsPlugin({
  electron: 'electron',
  'electron-fetch': 'electron-fetch',
  ...nodeExternals,
});

/**
 * These libraries should not be egarly bundled by vite.  They have strange dependencies and are not needed for the app.
 */
const excludeDeps = ['@apollo/client', `graphql`, 'ipfs-http-client'];

export default defineConfig({
  plugins: [reactPlugin(), macrosPlugin(), tsconfigPaths(), externals],
  build: {
    commonjsOptions: {
      include: /node_modules/,
      transformMixedEsModules: true,
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  esbuild: {
    jsxFactory: 'jsx',
    jsxInject: `import {jsx, css} from '@emotion/react'`,
  },
  define: {},
  optimizeDeps: {
    exclude: excludeDeps,
  },
  resolve: {
    preserveSymlinks: true,
    mainFields: ['module', 'main', 'browser'],
    alias: {
      '~~': resolve(__dirname, 'src'),
      process: 'process',
      ...nodeExternals,
    },
  },
  server: {
    watch: {
      followSymlinks: true,
    },
    fs: {
      // compatability for yarn workspaces
      allow: ['../../'],
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});

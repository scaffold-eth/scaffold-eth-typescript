import { resolve } from 'path';

import reactPlugin from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import checker from 'vite-plugin-checker';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import tsconfigPaths from 'vite-tsconfig-paths';

const isDev = process.env.ENVIRONMENT === 'DEVELOPMENT';
console.log('env.dev:', process.env.ENVIRONMENT, ' isDev:', isDev);
console.log();
console.log('Make sure to build the contracts with `yarn contracts:build` and deploy them with `yarn deploy`');
console.log();

/**
 * These libraries should not be egarly bundled by vite.  They have strange dependencies and are not needed for the app.
 */
const excludeDeps = ['@apollo/client', `graphql`, 'electron', 'electron-fetch'];

/**
 * browserify for web3 components
 */
const externals = {
  http: resolve(__dirname, './node_modules/http-browserify'),
  https: resolve(__dirname, './node_modules/http-browserify'),
  timers: resolve(__dirname, './node_modules/timers-browserify'),
  // the two below are due to strate ipfs-core dependency, they are not loaded
  electron: 'electron',
  'electron-fetch': 'electron-fetch',
};

const nodeShims = {
  util: resolve(__dirname, './node_modules/util'),
};

/**
 * Externals:
 * - node externals are required because web3 are terribly bundled and some of them use commonjs libraries.  modern libs like ethers help with this.
 * - electron:  added due to ipfs-http-client.  it has very poor esm compatibility and a ton of dependency bugs. see: https://github.com/ipfs/js-ipfs/issues/3452
 */
const externalPlugin = viteExternalsPlugin({
  ...externals,
  ...(isDev ? { ...nodeShims } : {}),
});

export default defineConfig({
  plugins: [reactPlugin(), macrosPlugin(), tsconfigPaths(), externalPlugin, checker({ typescript: true })],
  build: {
    minify: false,
    sourcemap: true,
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
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: excludeDeps,
    include: ['@scaffold-eth/common', 'eth-hooks', 'eth-components'],
  },
  resolve: {
    preserveSymlinks: true,
    mainFields: ['module', 'main', 'browser'],
    alias: {
      '~~': resolve(__dirname, 'src'),
      '~common': resolve(__dirname, '../common/src'),
      // -------------------------------------------
      // your aliases
      'eth-hooks': resolve(__dirname, './node_modules/eth-hooks'),
      'eth-components': resolve(__dirname, './node_modules/eth-components'),
      'react-css-theme-switcher': resolve(__dirname, './node_modules/react-css-theme-switcher'),
      react: resolve(__dirname, './node_modules/react'),
      'react-dom': resolve(__dirname, './node_modules/react-dom'),
      // -------------------------------------------
      ...externals,
      ...nodeShims,
      // required by web3 dependencies
      process: 'process',
      stream: 'stream-browserify',
    },
  },
  server: {
    port: 3000,
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

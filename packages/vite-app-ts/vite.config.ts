import { defineConfig } from 'vite';
//import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import reactPlugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path, { resolve } from 'path';
import { viteExternalsPlugin } from 'vite-plugin-externals';

const isDev = process.env.ENVIRONMENT == 'DEVELOPMENT';
console.log('env.dev:', process.env.ENVIRONMENT, ' isDev:', isDev);

const externals = viteExternalsPlugin({
  // added due to ipfs-http-client
  //  it has very poor esm compatibility and a ton of dependency bugs.
  //  see: https://github.com/ipfs/js-ipfs/issues/3452
  electron: 'electron',
  'electron-fetch': 'electron-fetch',
});

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
    exclude: ['@apollo/client', `graphql`],
  },
  resolve: {
    preserveSymlinks: true,
    mainFields: ['module', 'main', 'browser'],
    alias: {
      '~~': resolve(__dirname, 'src'),
      /** browserify for web3 components */
      stream: 'stream-browserify',
      http: 'http-browserify',
      https: 'http-browserify',
      timers: 'timers-browserify',
      process: 'process',
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

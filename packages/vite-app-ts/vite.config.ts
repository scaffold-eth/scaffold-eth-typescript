import { defineConfig } from 'vite';
//import reactRefresh from '@vitejs/plugin-react-refresh';
import macrosPlugin from 'vite-plugin-babel-macros';
import reactPlugin from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import path, { resolve } from 'path';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs';
import React from 'react';
import reactdom from 'react-dom';

//console.log('env:dev', process.env.ENVIRONMENT);
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), reactPlugin(), macrosPlugin(), tsconfigPaths()],

  build: {
    // sourcemap: true,
    commonjsOptions: {
      include: /node_modules/,
      transformMixedEsModules: true,
      ...{
        namedExports: {
          react: Object.keys(React),
          'react-dom': Object.keys(reactdom),
          // '@apollo/client': ['ApolloProvider', 'ApolloClient', 'HttpLink', 'InMemoryCache', 'useQuery', 'gql'],
          // 'styled-components': ['styled', 'css', 'ThemeProvider'],
        },
      },
    },
  },
  esbuild: {
    //jsxFactory: 'jsx',
    //jsxInject: `import {jsx, css} from '@emotion/react'`,
  },

  define: {},
  optimizeDeps: {
    include: ['react', 'react/jsx-runtime'],
    //exclude: ['@apollo/client', `graphql`, 'react'],
  },
  resolve: {
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
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});

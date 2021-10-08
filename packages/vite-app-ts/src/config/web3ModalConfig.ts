import Web3Modal, { ICoreOptions } from 'web3modal';

import { INFURA_ID } from '~~/models/constants/constants';

import Portis from '@portis/web3';
import Fortmatic from 'fortmatic';
// @ts-ignore
import WalletLink from 'walletlink';
import WalletConnectProvider from '@walletconnect/web3-provider';

// -------------------------
// 📝 NOTES:
// wallet link is disabled as web3-provider-engine
// it runs in dev mode, but you can't build a production output.
// see:
// - https://github.com/WalletConnect/walletconnect-monorepo/issues/310
// -------------------------

// Coinbase walletLink init
const walletLink = new WalletLink({
  appName: 'coinbase',
});

// WalletLink provider
const walletLinkProvider = walletLink.makeWeb3Provider(`https://mainnet.infura.io/v3/${INFURA_ID}`, 1);

const portis = {
  display: {
    logo: 'https://user-images.githubusercontent.com/9419140/128913641-d025bc0c-e059-42de-a57b-422f196867ce.png',
    name: 'Portis',
    description: 'Connect to Portis App',
  },
  package: Portis,
  options: {
    id: '6255fb2b-58c8-433b-a2c9-62098c05ddc9',
  },
};
const formatic = {
  package: Fortmatic,
  options: {
    key: 'pk_live_5A7C91B2FC585A17',
  },
};
const coinbaseWalletLink = {
  display: {
    logo: 'https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0',
    name: 'Coinbase',
    description: 'Connect to your Coinbase Wallet (not coinbase.com)',
  },
  package: walletLinkProvider,
  connector: async (provider: any, _options: any) => {
    await provider.enable();
    return provider;
  },
};
// const torus = {
//   package: Torus,
//   options: {
//     networkParams: {
//       host: 'https://localhost:8545',
//       chainId: 1337,
//       networkId: 1337, // optional
//     },
//     config: {
//       buildEnv: 'development',
//     },
//   },
// };
// const authereum = {
//   package: Authereum,
// };
const walletConnectWeb3 = {
  package: WalletConnectProvider,
  options: {
    bridge: 'https://polygon.bridge.walletconnect.org',
    infuraId: INFURA_ID,
    rpc: {
      1: `https://mainnet.infura.io/v3/${INFURA_ID}`,
      42: `https://kovan.infura.io/v3/${INFURA_ID}`,
      100: 'https://dai.poa.network',
    },
  },
};

export const web3ModalConfig: Partial<ICoreOptions> = {
  //network: 'mainnet', // Optional. If using WalletConnect on xDai, change network to "xdai" and add RPC info below for xDai chain.
  cacheProvider: true, // optional
  theme: 'light', // optional. Change to "dark" for a dark theme.
  providerOptions: {
    walletconnect: walletConnectWeb3,
    portis: portis,
    fortmatic: formatic,
    //torus: torus,
    //authereum: authereum,
    'custom-walletlink': coinbaseWalletLink,
  },
};

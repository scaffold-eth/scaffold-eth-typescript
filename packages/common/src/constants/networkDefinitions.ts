import { TNetworkInfo } from 'eth-hooks/models';

import { TNetworkNamesList } from '~common/models';

const INFURA_ID = process.env.VITE_RPC_MAINNET_INFURA;

let hostname = 'localhost';
if (typeof window !== 'undefined' && window != null) {
  hostname = window?.location?.hostname ?? 'localhost';
}

export type TNetworkDefinition = TNetworkInfo & {
  color: string;
};

export const networkDefinitions: Record<TNetworkNamesList, TNetworkDefinition> = {
  localhost: {
    name: 'localhost',
    color: '#666666',
    chainId: 31337,
    blockExplorer: '',
    rpcUrl: 'http://' + hostname + ':8545',
  },
  mainnet: {
    name: 'mainnet',
    color: '#ff8b9e',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://etherscan.io/',
  },
  kovan: {
    name: 'kovan',
    color: '#7003DD',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://kovan.etherscan.io/',
    faucet: 'https://gitter.im/kovan-testnet/faucet', // https://faucet.kovan.network/
  },
  rinkeby: {
    name: 'rinkeby',
    color: '#e0d068',
    chainId: 4,
    rpcUrl: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
    faucet: 'https://faucet.rinkeby.io/',
    blockExplorer: 'https://rinkeby.etherscan.io/',
  },
  ropsten: {
    name: 'ropsten',
    color: '#F60D09',
    chainId: 3,
    faucet: 'https://faucet.ropsten.be/',
    blockExplorer: 'https://ropsten.etherscan.io/',
    rpcUrl: `https://ropsten.infura.io/v3/${INFURA_ID}`,
  },
  goerli: {
    name: 'goerli',
    color: '#0975F6',
    chainId: 5,
    faucet: 'https://goerli-faucet.slock.it/',
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://goerli.infura.io/v3/${INFURA_ID}`,
  },
  xdai: {
    name: 'xdai',
    color: '#48a9a6',
    chainId: 100,
    price: 1,
    gasPrice: 1200000000,
    rpcUrl: 'https://dai.poa.network',
    faucet: 'https://xdai-faucet.top/',
    blockExplorer: 'https://blockscout.com/poa/xdai/',
  },
  polygon: {
    name: 'polygon',
    color: '#2bbdf7',
    chainId: 137,
    price: 1,
    gasPrice: 3500000000,
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    faucet: 'https://faucet.matic.network',
    blockExplorer: 'https://polygonscan.com',
  },
  mumbai: {
    name: 'mumbai',
    color: '#92D9FA',
    chainId: 80001,
    price: 1,
    gasPrice: 2000000000,
    rpcUrl: 'https://matic-mumbai.chainstacklabs.com',
    faucet: 'https://faucet.matic.network',
    blockExplorer: 'https://mumbai.polygonscan.com/',
  },
  rinkebyArbitrum: {
    name: 'Arbitrum Testnet',
    color: '#50a0ea',
    chainId: 421611,
    blockExplorer: 'https://rinkeby-explorer.arbitrum.io/#/',
    rpcUrl: `https://rinkeby.arbitrum.io/rpc`,
  },
  arbitrum: {
    name: 'Arbitrum',
    color: '#50a0ea',
    chainId: 42161,
    blockExplorer: 'https://explorer.arbitrum.io/#/',
    rpcUrl: `https://arb1.arbitrum.io/rpc`,
    gasPrice: 0,
  },
  kovanOptimism: {
    name: 'kovanOptimism',
    color: '#f01a37',
    chainId: 69,
    blockExplorer: 'https://kovan-optimistic.etherscan.io/',
    rpcUrl: `https://kovan.optimism.io`,
    gasPrice: 0,
  },
  optimism: {
    name: 'optimism',
    color: '#f01a37',
    chainId: 10,
    blockExplorer: 'https://optimistic.etherscan.io/',
    rpcUrl: `https://mainnet.optimism.io`,
  },
  fujiAvalanche: {
    name: 'fujiAvalanche',
    color: '#666666',
    chainId: 43113,
    blockExplorer: 'https://cchain.explorer.avax-test.network/',
    rpcUrl: `https://api.avax-test.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  avalanche: {
    name: 'avalanche',
    color: '#666666',
    chainId: 43114,
    blockExplorer: 'https://cchain.explorer.avax.network/',
    rpcUrl: `https://api.avax.network/ext/bc/C/rpc`,
    gasPrice: 225000000000,
  },
  fantom: {
    name: 'fantom',
    color: '#1969ff',
    chainId: 250,
    blockExplorer: 'https://ftmscan.com/',
    rpcUrl: `https://rpcapi.fantom.network`,
    gasPrice: 1000000000,
  },
  testnetFantom: {
    name: 'testnetFantom',
    color: '#1969ff',
    chainId: 4002,
    blockExplorer: 'https://testnet.ftmscan.com/',
    rpcUrl: `https://rpc.testnet.fantom.network`,
    gasPrice: 1000000000,
    faucet: 'https://faucet.fantom.network/',
  },
} as const;

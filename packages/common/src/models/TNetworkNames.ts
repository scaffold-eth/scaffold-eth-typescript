export const NetworkNames = {
  localhost: 'localhost',
  mainnet: 'mainnet',
  kovan: 'kovan',
  rinkeby: 'rinkeby',
  ropsten: 'ropsten',
  goerli: 'goerli',
  xdai: 'xdai',
  polygon: 'polygon',
  mumbai: 'mumbai',
  rinkebyArbitrum: 'rinkebyArbitrum',
  arbitrum: 'arbitrum',
  kovanOptimism: 'kovanOptimism',
  optimism: 'optimism',
  fujiAvalanche: 'fujiAvalanche',
  avalanche: 'avalanche',
  testnetFantom: 'testnetFantom',
  fantom: 'fantom',
} as const;

export type TNetworkNames = keyof typeof NetworkNames;

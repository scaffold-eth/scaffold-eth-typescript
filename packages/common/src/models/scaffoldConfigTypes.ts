export const NetworkNamesList = [
  'localhost',
  'mainnet',
  'kovan',
  'rinkeby',
  'ropsten',
  'goerli',
  'xdai',
  'polygon',
  'mumbai',
  'rinkebyArbitrum',
  'arbitrum',
  'kovanOptimism',
  'optimism',
  'fujiAvalanche',
  'avalanche',
  'testnetFantom',
  'fantom',
] as const;

export type TNetworkNamesList = typeof NetworkNamesList[number];
export type TNetworkNames = {
  [key in TNetworkNamesList]: key;
};

export const solidityToolkits = ['hardhat', 'foundry'] as const;
export type TSolidityToolkits = typeof solidityToolkits[number];

export const reactBuilds = ['vite', 'nextjs'] as const;
export type TReactBuilds = typeof reactBuilds[number];

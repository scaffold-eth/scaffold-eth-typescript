export const NetworkNames = [
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
export type TNetworkNames = typeof NetworkNames[number];

export const solidityToolkits = ['hardhat', 'foundry'] as const;
export type TSolidityToolkits = typeof solidityToolkits[number];

export const reactBuild = ['vite', 'nextjs'] as const;
export type TReactBuild = typeof reactBuild[number];

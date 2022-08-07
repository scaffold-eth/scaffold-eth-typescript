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

// export const NetworkNames = {
//   localhost: 'localhost',
//   mainnet: 'mainnet',
//   kovan: 'kovan',
//   rinkeby: 'rinkeby',
//   ropsten: 'ropsten',
//   goerli: 'goerli',
//   xdai: 'xdai',
//   polygon: 'polygon',
//   mumbai: 'mumbai',
//   rinkebyArbitrum: 'rinkebyArbitrum',
//   arbitrum: 'arbitrum',
//   kovanOptimism: 'kovanOptimism',
//   optimism: 'optimism',
//   fujiAvalanche: 'fujiAvalanche',
//   avalanche: 'avalanche',
//   testnetFantom: 'testnetFantom',
//   fantom: 'fantom',
// } as const;
// export type TNetworkNames = keyof typeof NetworkNames;
// type tt<t> = t extends TNetworkNames[] ? typeof NetworkNames[t] : never;

// const d = tt<typeof NetworkNames>;

// type d = ValueOf<TNetworkNames>;

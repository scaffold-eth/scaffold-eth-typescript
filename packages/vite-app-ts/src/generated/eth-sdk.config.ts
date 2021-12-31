import { defineConfig } from '@dethcrypto/eth-sdk';
import { networkIDtoSymbol } from '@dethcrypto/eth-sdk/dist/abi-management/networks';
import { externalContractsAddressMap } from '../config/externalContractsConfig';

const contractsByNetworkName: Record<string, any> = {};
Object.keys(externalContractsAddressMap)
  .map(Number)
  .forEach((chainId) => {
    const networkName = networkIDtoSymbol[chainId as keyof typeof networkIDtoSymbol];
    contractsByNetworkName[networkName] = externalContractsAddressMap[chainId];
  });

console.log(contractsByNetworkName);

export default defineConfig({
  contracts: contractsByNetworkName,
  outputPath: './src/generated/external-contracts/',
});

import { defineConfig } from '@dethcrypto/eth-sdk';
import { networkIDtoSymbol } from '@dethcrypto/eth-sdk/dist/abi-management/networks';
import { externalContractList } from '../config/externalContractList';

const contracts: Record<string, any> = {};
Object.keys(externalContractList)
  .map(Number)
  .forEach((m) => {
    const networkName = networkIDtoSymbol[m as keyof typeof networkIDtoSymbol];
    contracts[networkName] = externalContractList[m];
  });

export default defineConfig({
  contracts: contracts,
  outputPath: './src/generated/external-contracts/',
});

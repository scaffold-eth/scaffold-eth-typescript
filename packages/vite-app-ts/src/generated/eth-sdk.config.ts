import { defineConfig } from '@dethcrypto/eth-sdk';
import { contractsByNetworkName } from '../functions/contractsByNetworkName';

console.log(contractsByNetworkName);

export default defineConfig({
  contracts: contractsByNetworkName,
  outputPath: './src/generated/external-contracts/',
});

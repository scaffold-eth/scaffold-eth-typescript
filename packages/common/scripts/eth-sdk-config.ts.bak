/**
 * This file was automatically generated from eth-sdk.config.ts.bak
 */
 
import { defineConfig } from '@dethcrypto/eth-sdk';
/* the following import should be relative due to eth-sdk limitations */
import { contractsByNetworkName } from '../functions/contractsByNetworkName';

console.log(contractsByNetworkName);

export default defineConfig({
  contracts: contractsByNetworkName,
  outputPath: './src/generated/external-contracts/',
  typechainFlags: {
    discriminateTypes: true,
    alwaysGenerateOverloads: false,
  },
});

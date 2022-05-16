import { networkIDtoSymbol } from '@dethcrypto/eth-sdk/dist/abi-management/networks';

/* the following import should be relative due to eth-sdk limitations */
import { externalContractsAddressMap } from '../config/externalContracts.config';

/**
 * used by eth-sdk and `yarn contracts:build`
 */
export const contractsByNetworkName: Record<string, any> = {};
Object.keys(externalContractsAddressMap)
  .map(Number)
  .forEach((chainId) => {
    const networkName = networkIDtoSymbol[chainId as keyof typeof networkIDtoSymbol];
    contractsByNetworkName[networkName] = externalContractsAddressMap[chainId];
  });

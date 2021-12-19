import { TExternalContractsDefinition } from 'eth-hooks/models';

/**
 * The list of external contracts use by the app.
 * it is used to generate the type definitions for the external contracts by yarn build:contracts
 */
export const externalContractList: TExternalContractsDefinition = {
  1: {
    DAI: {
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    UNI: {
      address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    },
  },
};

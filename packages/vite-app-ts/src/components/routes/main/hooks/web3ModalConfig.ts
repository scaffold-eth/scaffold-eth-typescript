import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3Modal, { ICoreOptions } from 'web3modal';

import { INFURA_ID } from '~~/models/constants/constants';

export const web3ModalConfig: Partial<ICoreOptions> = {
  //cacheProvider: true,
  providerOptions: {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: INFURA_ID,
      },
    },
  },
};

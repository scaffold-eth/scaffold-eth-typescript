import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { getChainId, IAbstractConnectorOptions } from 'web3modal';

export interface IStaticJsonRpcProviderConnectorOptions extends IAbstractConnectorOptions {
  rpc: { [chainId: number]: string };
  currentChainId: number;
}

export const ConnectToStaticJsonRpcProvider = async (_package: any, opts: IStaticJsonRpcProviderConnectorOptions) => {
  const url = opts.rpc[opts.currentChainId];
  const provider = new StaticJsonRpcProvider(url, opts.currentChainId);
  try {
    await provider.getNetwork();
    await provider.getSigner();
    return provider;
  } catch (e) {
    throw e;
  }
};

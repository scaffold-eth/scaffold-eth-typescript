import { StaticJsonRpcProvider } from '@ethersproject/providers';
import input from 'antd/lib/input';
import { IWeb3ModalState, useBurnerSigner, useWeb3Modal } from 'eth-hooks';
import { TEthersProvider, TNetwork } from 'eth-hooks/models';
import { useEffect, useMemo, useState } from 'react';
import { web3ModalConfig } from '~~/components/routes/main/hooks/web3ModalConfig';
import { INFURA_ID } from '~~/models/constants/constants';
import { NETWORKS } from '~~/models/constants/networks';

// 😬 Sorry for all the console logging
const DEBUG = true;

/**
 * 📡 What chain are your contracts deployed to?
 */
export const targetNetwork: TNetwork = NETWORKS.localhost; // <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

// 🔭 block explorer URL
export const blockExplorer = targetNetwork.blockExplorer;

if (DEBUG) console.log('📡 Connecting to Mainnet Ethereum');
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
//
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
// Using StaticJsonRpcProvider as the chainId won't change see https://github.com/ethers-io/ethers.js/issues/901
const scaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544');
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID);

// ( ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;

// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
// const localProviderUrl = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER :
//   localProviderUrl;

if (DEBUG) console.log('🏠 Connecting to provider:', localProviderUrl);
const localProvider: TEthersProvider = new StaticJsonRpcProvider(localProviderUrl);

export interface IScaffoldProviders {
  currentProvider: TEthersProvider | undefined;
  currentTargetNetwork: TNetwork;
  mainnetProvider: StaticJsonRpcProvider;
  fallbackProvider: StaticJsonRpcProvider;
  isUsingFallback: boolean;
  web3ModalState: IWeb3ModalState;
}

export const useScaffoldProviders = (): IScaffoldProviders => {
  const [currentProvider, setCurrentProvider] = useState<TEthersProvider>();
  const currentMainnetProvider = useMemo(
    () => (scaffoldEthProvider && scaffoldEthProvider._network ? scaffoldEthProvider : mainnetInfura),
    [scaffoldEthProvider?._network?.name, mainnetInfura?._network?.name]
  );

  const web3ModalState = useWeb3Modal(web3ModalConfig, setCurrentProvider);

  return {
    currentProvider: (currentProvider ? currentProvider : !web3ModalState.initializing ? localProvider : undefined) as
      | TEthersProvider
      | undefined,
    mainnetProvider: currentMainnetProvider,
    fallbackProvider: localProvider,
    isUsingFallback: false,
    currentTargetNetwork: targetNetwork,
    web3ModalState: web3ModalState,
  };
};

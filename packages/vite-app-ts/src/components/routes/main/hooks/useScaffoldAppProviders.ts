import { StaticJsonRpcProvider } from '@ethersproject/providers';
import input from 'antd/lib/input';
import { IWeb3ModalState, useBurnerSigner, useWeb3Modal } from 'eth-hooks';
import { TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { useEffect, useMemo, useState } from 'react';
import { ICoreOptions } from 'web3modal';
import { INFURA_ID } from '~~/models/constants/constants';
import { NETWORKS } from '~~/models/constants/networks';
import { EthersAppConnector, useEthersContext } from 'eth-hooks/context';

// 😬 Sorry for all the console logging
const DEBUG = true;

// -------------------
// useful overview:  https://docs.ethers.io/v5/api-keys/
// -------------------

// -------------------
// 📡 What chain are your contracts deployed to? 🤚🏽  Set your target frontend network
// -------------------
const targetNetwork: TNetworkInfo = NETWORKS.localhost;
// <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)

if (DEBUG) console.log('📡 Connecting to Mainnet Ethereum');

// -------------------
// Connecting to mainnet
// -------------------
// ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I

// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544');
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID);
//const mainnetLightPool = new StaticJsonRpcProvider('https://main-light.eth.linkpool.io/');

// -------------------
// connecting to local provider
// -------------------
// 🏠 Your local provider is usually pointed at your local blockchain
const localProviderUrl = targetNetwork.rpcUrl;
// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
// const localProviderUrl = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER :
//   localProviderUrl;
if (DEBUG) console.log('🏠 Connecting to provider:', localProviderUrl);
const localProvider: TEthersProvider = new StaticJsonRpcProvider(localProviderUrl);

export interface IScaffoldAppProviders {
  currentProvider: TEthersProvider | undefined;
  targetNetwork: TNetworkInfo;
  mainnetProvider: StaticJsonRpcProvider;
  localProvider: StaticJsonRpcProvider;
  isUsingFallback: boolean;
}

export const useScaffoldProviders = (): IScaffoldAppProviders => {
  //const [currentProvider, setCurrentProvider] = useState<TEthersProvider>();
  const currentMainnetProvider = useMemo(
    () =>
      mainnetScaffoldEthProvider && mainnetScaffoldEthProvider._network ? mainnetScaffoldEthProvider : mainnetInfura,
    [mainnetScaffoldEthProvider?._network?.name, mainnetInfura?._network?.name]
  );
  const [web3Config, setWeb3Config] = useState<Partial<ICoreOptions>>();
  const ethersContext = useEthersContext();

  useEffect(() => {
    // import async to split bundles
    import('../../../../config/web3ModalConfig').then((value) => setWeb3Config(value.web3ModalConfig));
  }, []);

  useEffect(() => {
    if (web3Config) ethersContext.activate(new EthersAppConnector(web3Config));
  }, [web3Config]);

  //const web3ModalState = useWeb3Modal(web3Config, setCurrentProvider);

  return {
    currentProvider: ethersContext.provider ?? localProvider,
    mainnetProvider: currentMainnetProvider,
    localProvider: localProvider,
    isUsingFallback: ethersContext.provider == null,
    targetNetwork: targetNetwork,

    // return {
    //   currentProvider: (currentProvider ? currentProvider : !web3ModalState.initializing ? localProvider : undefined) as
    //     | TEthersProvider
    //     | undefined,
    //   mainnetProvider: currentMainnetProvider,
    //   localProvider: localProvider,
    //   isUsingFallback: false,
    //   targetNetwork: targetNetwork,
    //   web3ModalState: {web3ModalState},
  };
};

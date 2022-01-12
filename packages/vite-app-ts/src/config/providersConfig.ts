import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { DEBUG } from '~~/config/debug';
import { INFURA_ID } from '~~/models/constants/constants';
import { NETWORKS } from '~~/models/constants/networks';

export const const_UseBurnerWalletAsFallback = true;
export const const_ConnectToBurnerOnFirstLoad = true;

// 😬 Sorry for all the console logging
// -------------------
// useful overview:  https://docs.ethers.io/v5/api-keys/
// -------------------

// -------------------
// 📡 What chain are your contracts deployed to? 🤚🏽  Set your target frontend network
// -------------------
export const targetNetworkInfo: TNetworkInfo = NETWORKS.localhost;
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
export const mainnetProvider =
  mainnetScaffoldEthProvider && mainnetScaffoldEthProvider._network ? mainnetScaffoldEthProvider : mainnetInfura;

// -------------------
// connecting to local provider
// -------------------
// 🏠 Your local provider is usually pointed at your local blockchain
export const localNetworkInfo = NETWORKS.localhost;

// as you deploy to other networks you can set REACT_APP_PROVIDER=https://dai.poa.network in packages/react-app/.env
// const localProviderUrl = process.env.REACT_APP_PROVIDER ? process.env.REACT_APP_PROVIDER :
//   localProviderUrl;
if (DEBUG) console.log('🏠 Connecting to provider:', localNetworkInfo.rpcUrl);
export const localProvider: TEthersProvider = new StaticJsonRpcProvider(localNetworkInfo.rpcUrl);

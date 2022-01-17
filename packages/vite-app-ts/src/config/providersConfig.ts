import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TEthersProvider, TNetworkInfo } from 'eth-hooks/models';
import { DEBUG } from '~~/config/appConfig';
import { INFURA_ID } from '~~/models/constants/constants';
import { NETWORKS } from '~~/models/constants/networks';

export const const_UseBurnerWalletAsFallback = true;
export const const_ConnectToBurnerOnFirstLoad = true;

// -------------------
// API KEY OVERVIEW
// -------------------
// https://docs.ethers.io/v5/api-keys/

// -------------------
// 📡 What chain are your contracts deployed to?
// -------------------
// 🤚🏽  Set your target frontend network <------- select your target frontend network (localhost, rinkeby, xdai, mainnet)
export const targetNetworkInfo: TNetworkInfo = NETWORKS.localhost;
if (DEBUG) console.log(`📡 Connecting to ${targetNetworkInfo.name}`);

// -------------------
// Connecting to mainnet
// -------------------
// ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });

// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544');
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID);
// const mainnetLightPool = new StaticJsonRpcProvider('https://main-light.eth.linkpool.io/');
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);

// 🚊 your mainnet provider
export const mainnetProvider =
  mainnetScaffoldEthProvider && mainnetScaffoldEthProvider._network ? mainnetScaffoldEthProvider : mainnetInfura;

// -------------------
// connecting to local provider
// -------------------
// 🏠 Your local provider is usually pointed at your local blockchain
export const localNetworkInfo = NETWORKS.localhost;

if (DEBUG) console.log('🏠 Connecting to provider:', localNetworkInfo.rpcUrl);
export const localProvider: TEthersProvider = new StaticJsonRpcProvider(localNetworkInfo.rpcUrl);

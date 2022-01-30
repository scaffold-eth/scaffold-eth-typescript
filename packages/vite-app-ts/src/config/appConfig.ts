import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { invariant } from 'ts-invariant';

import { NETWORKS, TNetworkNames } from '../models/constants/networks';

export const DEBUG = true;
invariant.log('VITE_IS_DEVELOPMENT', import.meta.env.VITE_IS_DEVELOPMENT);
/** ******************************
 * TARGET NETWORK CONFIG
 ****************************** */
// 📡 What chain are your contracts deployed to?

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */

invariant.log('VITE_APP_TARGET_NETWORK', import.meta.env.VITE_APP_TARGET_NETWORK);
const targetNetwork: TNetworkNames = import.meta.env.VITE_APP_TARGET_NETWORK as TNetworkNames;
invariant.error(NETWORKS[targetNetwork] != null, `Invalid target network: ${targetNetwork}`);

export const TARGET_NETWORK_INFO: TNetworkInfo = NETWORKS[targetNetwork];
if (DEBUG) console.log(`📡 Connecting to ${TARGET_NETWORK_INFO.name}`);

/** ******************************
 * APP CONFIG
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED = true && import.meta.env.VITE_IS_DEVELOPMENT;
/**
 * Use burner wallet as fallback
 */
export const USE_BURNER_FALLBACK = true && import.meta.env.VITE_IS_DEVELOPMENT;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_ON_FIRST_LOAD = true && import.meta.env.VITE_IS_DEVELOPMENT;

export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

/** ******************************
 * OTHER FILES
 ****************************** */

/**
 * See web3ModalConfig.ts to setup your wallet connectors
 */

/**
 * See contractConnectorConfig.ts for your contract configuration
 */

/**
 * see apiKeysConfig.ts for your api keys
 */

/** ******************************
 * PROVIDERS CONFIG
 ****************************** */

// -------------------
// Connecting to mainnet
// -------------------
// ⚠️ Getting "failed to meet quorum" errors? Check your INFURA_I
// const mainnetProvider = getDefaultProvider("mainnet", { infura: INFURA_ID, etherscan: ETHERSCAN_KEY, quorum: 1 });

// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider(import.meta.env.VITE_RPC_MAINNET);
const mainnetInfura = new StaticJsonRpcProvider(
  `${import.meta.env.VITE_RPC_MAINNET}${import.meta.env.VITE_KEY_INFURA}`
);
// const mainnetLightPool = new StaticJsonRpcProvider('https://main-light.eth.linkpool.io/');
// const mainnetProvider = new InfuraProvider("mainnet",INFURA_ID);

// 🚊 your mainnet provider
export const MAINNET_PROVIDER =
  mainnetScaffoldEthProvider && mainnetScaffoldEthProvider._network ? mainnetScaffoldEthProvider : mainnetInfura;

// -------------------
// connecting to local provider
// -------------------

if (DEBUG) console.log('🏠 Connecting to provider:', NETWORKS.localhost.rpcUrl);
export const LOCAL_PROVIDER: TEthersProvider | undefined =
  TARGET_NETWORK_INFO === NETWORKS.localhost && import.meta.env.VITE_IS_DEVELOPMENT
    ? new StaticJsonRpcProvider(NETWORKS.localhost.rpcUrl)
    : undefined;

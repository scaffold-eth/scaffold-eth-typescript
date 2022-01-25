import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { NETWORKS } from '../models/constants/networks';
import { INFURA_ID } from './apiKeysConfig';

export const DEBUG = false;
export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'DEVELOPMENT';

/** ******************************
 * TARGET NETWORK CONFIG
 ****************************** */
// 📡 What chain are your contracts deployed to?

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */
export const TARGET_NETWORK_INFO: TNetworkInfo = NETWORKS.localhost;

if (DEBUG) console.log(`📡 Connecting to ${TARGET_NETWORK_INFO.name}`);

/** ******************************
 * APP CONFIG
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED = true && IS_DEVELOPMENT_ENV;
/**
 * Use burner wallet as fallback
 */
export const USE_BURNER_FALLBACK = true && IS_DEVELOPMENT_ENV;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_ON_FIRST_LOAD = true && IS_DEVELOPMENT_ENV;

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
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider('https://rpc.scaffoldeth.io:48544');
const mainnetInfura = new StaticJsonRpcProvider('https://mainnet.infura.io/v3/' + INFURA_ID);
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
  TARGET_NETWORK_INFO === NETWORKS.localhost && IS_DEVELOPMENT_ENV
    ? new StaticJsonRpcProvider(NETWORKS.localhost.rpcUrl)
    : undefined;

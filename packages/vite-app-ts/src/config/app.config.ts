import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { invariant } from 'ts-invariant';

import { networkDefinitions } from '~common/constants';
import { scaffoldConfig } from '~common/scaffold.config';

/** ******************************
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See packages/common/src/config for other config files
 ****************************** */
/**
 * See web3Modal.config.ts to setup your wallet connectors
 * See appContracts.config.ts for your contract configuration
 * See packages/common/scaffold.config.ts for scaffold configuration
 * see .env files for api keys
 */

export const DEBUG = true;
invariant.log('MODE', import.meta.env.MODE, import.meta.env.DEV);
/** ******************************
 * TARGET NETWORK CONFIG: 📡 What chain are your contracts deployed to?
 ****************************** */

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */

export const TARGET_NETWORKS = scaffoldConfig.runtime.targetNetworks;
invariant.log('Target Network', TARGET_NETWORKS);
TARGET_NETWORKS.forEach((t) => {
  invariant(
    networkDefinitions[t] != null,
    `Invalid target network: ${t}.  Check scaffold.config.json and network definition in /packages/common/src/constants/networks.ts`
  );
});

export const TARGET_NETWORK_INFO: { [chainId: number]: TNetworkInfo } = {};
TARGET_NETWORKS.forEach((m) => (TARGET_NETWORK_INFO[networkDefinitions[m].chainId] = networkDefinitions[m]));

if (DEBUG) console.log(`📡 Can connect to `, TARGET_NETWORK_INFO);

/** ******************************
 * LOCAL HOST CONFIG:
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED: boolean = import.meta.env.VITE_FAUCET_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Use burner wallet as fallback
 */
export const BURNER_FALLBACK_ENABLED = import.meta.env.VITE_BURNER_FALLBACK_ALLOWED === 'true' && import.meta.env.DEV;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_AUTOMATICALLY =
  import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY === 'true' && import.meta.env.DEV;

if (DEBUG)
  invariant.log(
    `import.meta.env.DEV: ${import.meta.env.DEV}`,
    `import.meta.env.VITE_FAUCET_ALLOWED: ${import.meta.env.VITE_FAUCET_ALLOWED}`,
    `import.meta.env.VITE_BURNER_FALLBACK_ALLOWED: ${import.meta.env.VITE_BURNER_FALLBACK_ALLOWED}`,
    `import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY: ${import.meta.env.VITE_CONNECT_TO_BURNER_AUTOMATICALLY}`
  );

if (DEBUG)
  invariant.log(
    `FAUCET_ENABLED: ${FAUCET_ENABLED}`,
    `BURNER_FALLBACK_ENABLED: ${BURNER_FALLBACK_ENABLED}`,
    `CONNECT_TO_BURNER_AUTOMATICALLY: ${CONNECT_TO_BURNER_AUTOMATICALLY}`
  );
/** ******************************
 * PROVIDERS CONFIG
 ****************************** */

export const INFURA_ID = import.meta.env.VITE_KEY_INFURA ?? scaffoldConfig.runtime.buidlGuidl.infuraId;

// -------------------
// Connecting to mainnet
// -------------------
const mainnetProvider = new StaticJsonRpcProvider(
  import.meta.env.VITE_RPC_MAINNET ?? scaffoldConfig.runtime.buidlGuidl.rpcMainnet
);

// incase there are issues
// const mainnetProvider = new InfuraProvider('mainnet', import.meta.env.VITE_KEY_INFURA);

// 🚊 your mainnet provider
export const MAINNET_PROVIDER = mainnetProvider;

// -------------------
// connecting to local provider
// -------------------

if (DEBUG) console.log('🏠 Connecting to local provider:', networkDefinitions.localhost.url);

export const LOCAL_PROVIDER: TEthersProvider | undefined =
  TARGET_NETWORK_INFO[networkDefinitions.localhost.chainId] != null && import.meta.env.DEV
    ? new StaticJsonRpcProvider(networkDefinitions.localhost.url)
    : undefined;

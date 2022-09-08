/* eslint-disable @typescript-eslint/no-namespace */

import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { invariant } from 'ts-invariant';

import { networkDefinitions } from '~common/constants';
import { scaffoldConfig } from '~common/scaffold.config';

// import { loadScaffoldConfig } from '~common/scaffold.config';

/** ****************************** */
// global environmental variable declarations
/** ****************************** */
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_ISDEV: string;

      readonly NEXT_PUBLIC_RPC_MAINNET: string;
      readonly NEXT_PUBLIC_RPC_MAINNET_INFURA: string;
      readonly NEXT_PUBLIC_KEY_INFURA: string;
      readonly NEXT_PUBLIC_KEY_ETHERSCAN: string;
      readonly NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID: string;
      readonly NEXT_PUBLIC_FAUCET_ALLOWED: string;
      readonly NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED: string;
      readonly NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY: string;
    }
  }
}

export const DEBUG = false;

/** ******************************
 * SUBGRAPH
 * ****************************** */
export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

export const BLOCKNATIVE_DAPPID = process.env.NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID;

/** ******************************
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See ../../common/src/config for other config files
 ****************************** */
/**
 * See web3Modal.config.ts to setup your wallet connectors
 * See appContracts.config.ts for your contract configuration
 * See packages/common/scaffold.config.ts for scaffold configuration
 * see .env files for api keys
 */

// const scaffoldConfig = await loadScaffoldConfig();

invariant.log('NODE_ENV', process.env.NODE_ENV);
const isDev = process.env.NODE_ENV === 'development';
invariant.log('env:dev', isDev);
/** ******************************
 * TARGET NETWORK CONFIG: 📡 What chain are your contracts deployed to?
 ****************************** */

/**
 * This constant is your target network that the app is pointed at
 * 🤚🏽  Set your target frontend network <--- select your target frontend network(localhost, rinkeby, xdai, mainnet)
 */

const AVAILABLE_NETWORKS = scaffoldConfig.runtime.availableNetworks;
invariant.log('Available Networks', AVAILABLE_NETWORKS);
AVAILABLE_NETWORKS.forEach((t) => {
  invariant(
    networkDefinitions[t] != null,
    `Invalid available networks: ${t}.  Check scaffold.config.json and network definition in /packages/common/src/constants/networks.ts`
  );
});

export const AVAILABLE_NETWORKS_DEFINITIONS: Record<string, TNetworkInfo> = {};
AVAILABLE_NETWORKS.forEach(
  (m) => (AVAILABLE_NETWORKS_DEFINITIONS[networkDefinitions[m].chainId] = networkDefinitions[m])
);

if (DEBUG) console.log(`📡 Can connect to `, AVAILABLE_NETWORKS_DEFINITIONS);

/** ******************************
 * APP CONFIG:
 ****************************** */
/**
 * localhost faucet enabled
 */
export const FAUCET_ENABLED: boolean = process.env.NEXT_PUBLIC_FAUCET_ALLOWED === 'true' && isDev;
/**
 * Use burner wallet as fallback
 */
export const BURNER_FALLBACK_ENABLED: boolean = process.env.NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED === 'true' && isDev;
/**
 * Connect to burner on first load if there are no cached providers
 */
export const CONNECT_TO_BURNER_AUTOMATICALLY =
  process.env.NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY === 'true' && isDev;

if (DEBUG)
  invariant.log(
    `process.env.DEV: ${isDev}`,
    `process.env.NEXT_PUBLIC_FAUCET_ALLOWED: ${process.env.NEXT_PUBLIC_FAUCET_ALLOWED}`,
    `process.env.NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED: ${process.env.NEXT_PUBLIC_BURNER_FALLBACK_ALLOWED}`,
    `process.env.NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY: ${process.env.NEXT_PUBLIC_CONNECT_TO_BURNER_AUTOMATICALLY}`
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

export const INFURA_ID: string = process.env.NEXT_PUBLIC_KEY_INFURA;
// -------------------
// Connecting to mainnet
// -------------------
const mainnetProvider = new StaticJsonRpcProvider(
  process.env.NEXT_PUBLIC_RPC_MAINNET ?? scaffoldConfig.runtime.buidlGuidl.rpcMainnet
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
  AVAILABLE_NETWORKS_DEFINITIONS[networkDefinitions.localhost.chainId] != null && isDev
    ? new StaticJsonRpcProvider(networkDefinitions.localhost.rpcUrl)
    : undefined;

if (DEBUG) console.log('LOCAL_PROVIDER', LOCAL_PROVIDER);

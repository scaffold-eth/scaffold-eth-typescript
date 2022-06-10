/* eslint-disable @typescript-eslint/no-namespace */

import { StaticJsonRpcProvider } from '@ethersproject/providers';
import { TNetworkInfo, TEthersProvider } from 'eth-hooks/models';
import { invariant } from 'ts-invariant';

import { NETWORKS } from '~common/constants';
import { TNetworkNames } from '~common/models/TNetworkNames';

// global environmental variable declarations
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly NEXT_PUBLIC_ISDEV: string;

      readonly NEXT_PUBLIC_APP_TARGET_NETWORK: string;
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

/** ******************************
 * ⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️⛳️
 * See ../../common/src/config for other config files
 ****************************** */

export const DEBUG = true;
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

const targetNetwork: TNetworkNames = process.env.NEXT_PUBLIC_TARGET_NETWORK as TNetworkNames;
invariant.log('NEXT_PUBLIC_TARGET_NETWORK', process.env.NEXT_PUBLIC_TARGET_NETWORK);
invariant(NETWORKS[targetNetwork] != null, `Invalid target network: ${targetNetwork}`);

export const TARGET_NETWORK_INFO: TNetworkInfo = NETWORKS[targetNetwork];
if (DEBUG) console.log(`📡 Connecting to ${TARGET_NETWORK_INFO.name}`);

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

export const SUBGRAPH_URI = 'http://localhost:8000/subgraphs/name/scaffold-eth/your-contract';

export const BLOCKNATIVE_DAPPID = process.env.NEXT_PUBLIC_KEY_BLOCKNATIVE_DAPPID;
if (DEBUG) invariant.log(`BLOCKNATIVE_DAPPID: ${BLOCKNATIVE_DAPPID}`);

/** ******************************
 * OTHER FILES
 ****************************** */

/**
 * See web3Modal.config.ts to setup your wallet connectors
 */

/**
 * See appContracts.config.ts for your contract configuration
 */

/**
 * see .env files for api keys
 */

/** ******************************
 * PROVIDERS CONFIG
 ****************************** */

export const INFURA_ID: string = process.env.NEXT_PUBLIC_KEY_INFURA;

// -------------------
// Connecting to mainnet
// -------------------
// attempt to connect to our own scaffold eth rpc and if that fails fall back to infura...
const mainnetScaffoldEthProvider = new StaticJsonRpcProvider(process.env.NEXT_PUBLIC_RPC_MAINNET);
const mainnetInfura = new StaticJsonRpcProvider(
  `${process.env.NEXT_PUBLIC_RPC_MAINNET_INFURA}/${process.env.NEXT_PUBLIC_KEY_INFURA}`
);
// const mainnetProvider = new InfuraProvider("mainnet",process.env.NEXT_PUBLIC_KEY_INFURA);

// 🚊 your mainnet provider
export const MAINNET_PROVIDER = mainnetScaffoldEthProvider;

// -------------------
// connecting to local provider
// -------------------

const localhost: TNetworkInfo = NETWORKS.localhost;
if (DEBUG) console.log('🏠 Connecting to local provider:', localhost.url);
export const LOCAL_PROVIDER: TEthersProvider | undefined =
  TARGET_NETWORK_INFO === localhost && isDev ? new StaticJsonRpcProvider(localhost.url) : undefined;

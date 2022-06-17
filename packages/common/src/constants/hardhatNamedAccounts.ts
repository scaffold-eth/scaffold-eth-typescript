import { TNetworkNames } from "../models/TNetworkNames";

type TChain = TNetworkNames | number;
type TAccountName =
  | "deployer"
  | "user1"
  | "user2"
  | "user3"
  | "user4"
  | "user5"
  | "governance";

/**
 * The default account to use for hardhat.  For example 0 will take by default take the first account of hardhat
 */
type TDefaultAccount = {
  ["default"]: number | string;
};

/**
 * Named accounts to be used by hardaht.  See docs: https://github.com/wighawag/hardhat-deploy#1-namedaccounts-ability-to-name-addresses
 *
 * the values are account addresses, or account number in hardhat
 */
export const hardhatNamedAccounts: {
  [name in TAccountName]: Readonly<
    Partial<{ [network in TChain]: number | string }> & TDefaultAccount
  >;
} = {
  deployer: {
    default: 0, // here this will by default take the first account as deployer
    /*    1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    4: 0, // but for rinkeby it will be a specific address
    goerli: 0, // it can also specify a specific netwotk name (specified in hardhat.config.js)*/
  },
  user1: {
    default: 1,
  },
  user2: {
    default: 2,
  },
  user3: {
    default: 3,
  },
  user4: {
    default: 4,
  },
  user5: {
    default: 5,
  },
  governance: {
    default: 10,
  },
} as const;

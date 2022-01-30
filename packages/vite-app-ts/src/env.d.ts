interface ImportMetaEnv {
  readonly VITE_IS_DEVELOPMENT: boolean;
  readonly VITE_APP_TARGET_NETWORK: string;
  readonly VITE_RPC_MAINNET: string;
  readonly VITE_KEY_INFURA: string;
  readonly VITE_KEY_ETHERSCAN: string;
  readonly VITE_KEY_BLOCKNATIVE_DAPPID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

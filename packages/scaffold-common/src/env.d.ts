interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly MODE: 'development' | 'production';

  readonly VITE_APP_TARGET_NETWORK: string;
  readonly VITE_RPC_MAINNET: string;
  readonly VITE_RPC_MAINNET_INFURA: string;
  readonly VITE_KEY_INFURA: string;
  readonly VITE_KEY_ETHERSCAN: string;
  readonly VITE_KEY_BLOCKNATIVE_DAPPID: string;
  readonly VITE_FAUCET_ALLOWED: string;
  readonly VITE_BURNER_FALLBACK_ALLOWED: string;
  readonly VITE_CONNECT_TO_BURNER_AUTOMATICALLY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

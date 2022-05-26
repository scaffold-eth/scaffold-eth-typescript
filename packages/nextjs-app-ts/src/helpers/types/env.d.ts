declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly DEV: boolean;

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

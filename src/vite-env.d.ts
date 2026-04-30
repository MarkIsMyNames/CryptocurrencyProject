/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string | undefined
  readonly VITE_MAX_SUPPLY: string | undefined
  readonly VITE_TICKET_PRICE_WEI: string | undefined
  readonly VITE_SEPOLIA_RPC_URL: string | undefined
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

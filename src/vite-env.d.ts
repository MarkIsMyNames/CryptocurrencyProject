/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_MAX_SUPPLY: string
  readonly VITE_TICKET_PRICE_WEI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

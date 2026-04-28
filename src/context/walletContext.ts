import { createContext } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'

export interface WalletContextValue {
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  address: string | null
  ethBalance: bigint | null
  etkBalance: bigint | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

export const WalletContext = createContext<WalletContextValue | null>(null)

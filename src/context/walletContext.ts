import { createContext } from 'react'
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'

export interface WalletContextValue {
  provider: BrowserProvider | JsonRpcProvider | null
  signer: JsonRpcSigner | Wallet | null
  address: string | null
  ethBalance: bigint | null
  etkBalance: bigint | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => Promise<void>
  connectWithWallet: (privateKey: string) => Promise<boolean>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

export const WalletContext = createContext<WalletContextValue | null>(null)

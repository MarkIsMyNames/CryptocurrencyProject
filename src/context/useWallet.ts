import { createContext, useContext } from 'react'
import { BrowserProvider, JsonRpcProvider, JsonRpcSigner, Wallet } from 'ethers'
import strings from '../locales/en.json'

export interface WalletContextValue {
  provider: BrowserProvider | JsonRpcProvider | null
  signer: JsonRpcSigner | Wallet | null
  address: string | null
  ethBalance: bigint | null
  etkBalance: bigint | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  connect: () => Promise<boolean>
  connectWithWallet: (privateKey: string) => Promise<boolean>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

export interface ConnectedWalletContextValue extends WalletContextValue {
  provider: BrowserProvider | JsonRpcProvider
  signer: JsonRpcSigner | Wallet
  address: string
}

export const WalletContext = createContext<WalletContextValue | null>(null)

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error(strings.errors.hookOutsideProvider)
  return ctx
}

function isConnected(wallet: WalletContextValue): wallet is ConnectedWalletContextValue {
  return !!(wallet.isConnected && wallet.provider && wallet.signer && wallet.address)
}

export function useConnectedWallet(): ConnectedWalletContextValue {
  const wallet = useWallet()
  if (!isConnected(wallet)) throw new Error(strings.errors.notConnected)
  return wallet
}

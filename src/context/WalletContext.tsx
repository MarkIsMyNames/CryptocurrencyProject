/* eslint-disable react-refresh/only-export-components -- context files always co-export hooks with the provider */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { config } from '../config'
import { getContract } from '../utils/contract'

interface WalletState {
  provider: BrowserProvider | null
  signer: JsonRpcSigner | null
  address: string | null
  ethBalance: bigint | null
  etkBalance: bigint | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>
  disconnect: () => void
  refreshBalances: () => Promise<void>
}

export const WalletContext = createContext<WalletContextValue | null>(null)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>({
    provider: null,
    signer: null,
    address: null,
    ethBalance: null,
    etkBalance: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  })

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: 'MetaMask not detected' }))
      return
    }
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))
    try {
      let provider = new BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      if (Number(network.chainId) !== config.sepoliaChainId) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: config.sepoliaChainIdHex }],
        })
        provider = new BrowserProvider(window.ethereum)
      }
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const contract = getContract(signer)
      const [ethBalance, rawEtkBalance] = await Promise.all([
        provider.getBalance(address),
        contract.balanceOf(address) as Promise<unknown>,
      ])
      const etkBalance = BigInt(String(rawEtkBalance))
      setState({
        provider,
        signer,
        address,
        ethBalance,
        etkBalance,
        isConnected: true,
        isConnecting: false,
        error: null,
      })
    } catch {
      setState((prev) => ({ ...prev, isConnecting: false, error: 'Connection failed' }))
    }
  }, [])

  const disconnect = useCallback(() => {
    setState({
      provider: null,
      signer: null,
      address: null,
      ethBalance: null,
      etkBalance: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    })
  }, [])

  const refreshBalances = useCallback(async () => {
    if (!state.provider || !state.address) return
    const contract = getContract(state.provider)
    const [ethBalance, rawEtkBalance] = await Promise.all([
      state.provider.getBalance(state.address),
      contract.balanceOf(state.address) as Promise<unknown>,
    ])
    const etkBalance = BigInt(String(rawEtkBalance))
    setState((prev) => ({ ...prev, ethBalance, etkBalance }))
  }, [state.provider, state.address])

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect, refreshBalances }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside WalletProvider')
  return ctx
}

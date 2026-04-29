import { useState, useCallback, type ReactNode } from 'react'
import { BrowserProvider, JsonRpcProvider, Wallet } from 'ethers'
import { config } from '../config'
import strings from '../locales/en.json'
import { balanceOf, decodeContractError } from '../utils/contract'
import { WalletContext, type WalletContextValue } from './walletContext'

interface WalletState {
  provider: BrowserProvider | JsonRpcProvider | null
  signer: WalletContextValue['signer']
  address: string | null
  ethBalance: bigint | null
  etkBalance: bigint | null
  isConnected: boolean
  isConnecting: boolean
  error: string | null
}

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
      setState((prev) => ({ ...prev, error: strings.createWallet.metaMaskNotFound }))
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
      const [ethBalance, etkBalance] = await Promise.all([
        provider.getBalance(address),
        config.contractAddress ? balanceOf(signer, address) : Promise.resolve(0n),
      ])
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
    } catch (err) {
      setState((prev) => ({ ...prev, isConnecting: false, error: decodeContractError(err) }))
    }
  }, [])

  const connectWithWallet = useCallback(async (privateKey: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))
    let connected = false
    try {
      const provider = new JsonRpcProvider(config.sepoliaRpcUrl)
      const signer = new Wallet(privateKey, provider)
      const address = signer.address
      setState({
        provider,
        signer,
        address,
        ethBalance: null,
        etkBalance: null,
        isConnected: true,
        isConnecting: false,
        error: null,
      })
      connected = true
      // Best-effort balance fetch — RPC may be unreachable on first connect
      const [ethBalance, etkBalance] = await Promise.all([
        provider.getBalance(address),
        config.contractAddress ? balanceOf(signer, address) : Promise.resolve(0n),
      ])
      setState((prev) => ({ ...prev, ethBalance, etkBalance }))
    } catch {
      if (!connected) {
        setState((prev) => ({ ...prev, isConnecting: false, error: strings.errors.unknownError }))
      }
    }
    return connected
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
    const [ethBalance, etkBalance] = await Promise.all([
      state.provider.getBalance(state.address),
      config.contractAddress ? balanceOf(state.provider, state.address) : Promise.resolve(0n),
    ])
    setState((prev) => ({ ...prev, ethBalance, etkBalance }))
  }, [state.provider, state.address])

  return (
    <WalletContext.Provider
      value={{ ...state, connect, connectWithWallet, disconnect, refreshBalances }}
    >
      {children}
    </WalletContext.Provider>
  )
}

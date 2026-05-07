import { useState, useCallback, useEffect, type ReactNode } from 'react'
import { BrowserProvider, JsonRpcProvider, Wallet } from 'ethers'
import { config } from '../config'
import strings from '../locales/en.json'
import { balanceOf, decodeContractError } from '../utils/contract'
import { WalletContext, type WalletContextValue } from './useWallet'

type WalletState = Omit<
  WalletContextValue,
  'connect' | 'connectWithWallet' | 'disconnect' | 'refreshBalances'
>

const disconnectedState: WalletState = {
  provider: null,
  signer: null,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
}

function connectedState(
  provider: BrowserProvider | JsonRpcProvider,
  signer: WalletContextValue['signer'],
  address: string,
  ethBalance: bigint | null,
  etkBalance: bigint | null,
): WalletState {
  return {
    provider,
    signer,
    address,
    ethBalance,
    etkBalance,
    isConnected: true,
    isConnecting: false,
    error: null,
  }
}

async function fetchBalances(
  provider: BrowserProvider | JsonRpcProvider,
  address: string,
): Promise<[bigint, bigint]> {
  return Promise.all([provider.getBalance(address), balanceOf(provider, address)])
}

async function getSepoliaProvider(
  ethereum: NonNullable<typeof window.ethereum>,
): Promise<BrowserProvider> {
  const provider = new BrowserProvider(ethereum)
  const network = await provider.getNetwork()
  if (network.chainId !== BigInt(config.sepoliaChainId)) {
    await ethereum
      .request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: config.sepoliaChainIdHex }],
      })
      .catch(async (err: unknown) => {
        if ((err as { code?: number }).code !== config.metamaskChainNotFoundCode) throw err
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: config.sepoliaChainIdHex,
              chainName: 'Sepolia',
              nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              rpcUrls: [config.sepoliaRpcUrl],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            },
          ],
        })
      })
    return new BrowserProvider(ethereum)
  }
  return provider
}

const WALLET_PK_KEY = 'wallet_pk'

export function WalletProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WalletState>(disconnectedState)

  const connect = useCallback(async (): Promise<boolean> => {
    if (!window.ethereum) {
      setState((prev) => ({ ...prev, error: strings.createWallet.metaMaskNotFound }))
      return false
    }
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))
    try {
      const provider = await getSepoliaProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const address = await signer.getAddress()
      const [ethBalance, etkBalance] = await fetchBalances(provider, address)
      setState(connectedState(provider, signer, address, ethBalance, etkBalance))
      return true
    } catch (err) {
      setState((prev) => ({ ...prev, isConnecting: false, error: decodeContractError(err) }))
      return false
    }
  }, [])

  const connectWithWallet = useCallback(async (privateKey: string): Promise<boolean> => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }))
    let connected = false
    try {
      const provider = new JsonRpcProvider(config.sepoliaRpcUrl)
      const signer = new Wallet(privateKey, provider)
      const address = signer.address
      setState(connectedState(provider, signer, address, null, null))
      connected = true
      sessionStorage.setItem(WALLET_PK_KEY, privateKey)
      // Best-effort balance fetch — RPC may be unreachable on first connect
      const [ethBalance, etkBalance] = await fetchBalances(provider, address)
      setState((prev) => ({ ...prev, ethBalance, etkBalance }))
    } catch (err) {
      if (!connected) {
        setState((prev) => ({ ...prev, isConnecting: false, error: decodeContractError(err) }))
      }
    }
    return connected
  }, [])

  const disconnect = useCallback(() => {
    sessionStorage.removeItem(WALLET_PK_KEY)
    setState(disconnectedState)
  }, [])

  // Rehydrate on mount: private-key wallet from sessionStorage, MetaMask via eth_accounts
  useEffect(() => {
    const storedKey = sessionStorage.getItem(WALLET_PK_KEY)
    if (storedKey) {
      void connectWithWallet(storedKey)
      return
    }
    if (!window.ethereum) return
    void (window.ethereum.request({ method: 'eth_accounts' }) as Promise<string[]>).then(
      (accounts) => {
        if (accounts.length > 0) void connect()
      },
    )
  }, [connect, connectWithWallet])

  const refreshBalances = useCallback(async (expectedEtk?: bigint) => {
    if (!state.provider || !state.address) throw new Error(strings.errors.notConnected)
    const maxAttempts = expectedEtk !== undefined ? 10 : 1
    for (let i = 0; i < maxAttempts; i++) {
      const [ethBalance, etkBalance] = await fetchBalances(state.provider, state.address)
      if (expectedEtk === undefined || etkBalance === expectedEtk) {
        setState((prev) => ({ ...prev, ethBalance, etkBalance }))
        return
      }
      await new Promise((resolve) => setTimeout(resolve, 1500))
    }
    const [ethBalance, etkBalance] = await fetchBalances(state.provider, state.address)
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

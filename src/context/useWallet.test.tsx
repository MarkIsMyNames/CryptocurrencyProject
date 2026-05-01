import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import type { ReactNode } from 'react'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { WalletProvider } from './WalletContext'
import { WalletContext, useWallet, useConnectedWallet, type WalletContextValue } from './useWallet'
import strings from '../locales/en.json'

function withProvider(children: ReactNode) {
  return <WalletProvider>{children}</WalletProvider>
}

const connectedValue: WalletContextValue = {
  isConnected: true,
  address: '0x1234567890abcdef1234567890abcdef12345678',
  provider: {} as unknown as BrowserProvider,
  signer: {} as unknown as JsonRpcSigner,
  ethBalance: 1000000000000000000n,
  etkBalance: 1n,
  isConnecting: false,
  error: null,
  connect: () => Promise.resolve(false),
  disconnect: () => {},
  connectWithWallet: () => Promise.resolve(true),
  refreshBalances: () => Promise.resolve(),
}

function withConnectedProvider(children: ReactNode) {
  return <WalletContext.Provider value={connectedValue}>{children}</WalletContext.Provider>
}

describe('useWallet', () => {
  it('returns disconnected initial state inside WalletProvider', () => {
    const { result } = renderHook(useWallet, { wrapper: ({ children }) => withProvider(children) })
    expect(result.current.isConnected).toBe(false)
    expect(result.current.address).toBeNull()
    expect(result.current.ethBalance).toBeNull()
    expect(result.current.etkBalance).toBeNull()
    expect(result.current.isConnecting).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('throws outside WalletProvider', () => {
    expect(() => renderHook(useWallet)).toThrow(strings.errors.hookOutsideProvider)
  })

  it('exposes connect, disconnect, connectWithWallet, refreshBalances as functions', () => {
    const { result } = renderHook(useWallet, { wrapper: ({ children }) => withProvider(children) })
    expect(typeof result.current.connect).toBe('function')
    expect(typeof result.current.disconnect).toBe('function')
    expect(typeof result.current.connectWithWallet).toBe('function')
    expect(typeof result.current.refreshBalances).toBe('function')
  })
})

describe('useConnectedWallet', () => {
  it('throws in disconnected state', () => {
    expect(() =>
      renderHook(useConnectedWallet, { wrapper: ({ children }) => withProvider(children) }),
    ).toThrow(strings.errors.notConnected)
  })

  it('returns non-nullable provider, signer, address when connected', () => {
    const { result } = renderHook(useConnectedWallet, {
      wrapper: ({ children }) => withConnectedProvider(children),
    })
    expect(result.current.provider).not.toBeNull()
    expect(result.current.signer).not.toBeNull()
    expect(result.current.address).toBe(connectedValue.address)
    expect(result.current.isConnected).toBe(true)
  })
})

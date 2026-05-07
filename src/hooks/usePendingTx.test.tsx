import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReactNode } from 'react'
import { WalletContext, type WalletContextValue } from '../context/useWallet'
import { BrowserProvider } from 'ethers'
import { usePendingTx } from './usePendingTx'

const mockRefreshBalances = vi.fn()
const mockWaitForTransaction = vi.fn()

const connectedValue: WalletContextValue = {
  isConnected: true,
  address: '0xabc',
  provider: { waitForTransaction: mockWaitForTransaction } as unknown as BrowserProvider,
  signer: null,
  ethBalance: null,
  etkBalance: 1n,
  isConnecting: false,
  error: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  connectWithWallet: vi.fn(),
  refreshBalances: mockRefreshBalances,
}

const disconnectedValue: WalletContextValue = {
  ...connectedValue,
  isConnected: false,
  provider: null,
  address: null,
}

function makeWrapper(value: WalletContextValue) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  }
}

beforeEach(() => {
  sessionStorage.clear()
  mockRefreshBalances.mockReset()
  mockWaitForTransaction.mockReset()
})

describe('usePendingTx', () => {
  it('does nothing on mount when sessionStorage is empty', () => {
    renderHook(() => usePendingTx('testKey'), { wrapper: makeWrapper(connectedValue) })
    expect(mockWaitForTransaction).not.toHaveBeenCalled()
  })

  it('does nothing when wallet is disconnected even if hash is stored', () => {
    sessionStorage.setItem('testKey', '0xdeadbeef')
    renderHook(() => usePendingTx('testKey'), { wrapper: makeWrapper(disconnectedValue) })
    expect(mockWaitForTransaction).not.toHaveBeenCalled()
  })

  it('waits for stored tx and refreshes balances on mount when connected', async () => {
    sessionStorage.setItem('testKey', '0xdeadbeef')
    mockWaitForTransaction.mockResolvedValue({})
    mockRefreshBalances.mockResolvedValue(undefined)

    renderHook(() => usePendingTx('testKey'), { wrapper: makeWrapper(connectedValue) })

    await act(async () => {
      await Promise.resolve()
    })

    expect(mockWaitForTransaction).toHaveBeenCalledWith('0xdeadbeef')
    expect(mockRefreshBalances).toHaveBeenCalledOnce()
    expect(sessionStorage.getItem('testKey')).toBeNull()
  })

  it('clears stored hash even if waitForTransaction rejects', async () => {
    sessionStorage.setItem('testKey', '0xdeadbeef')
    mockWaitForTransaction.mockRejectedValue(new Error('timeout'))
    mockRefreshBalances.mockResolvedValue(undefined)

    renderHook(() => usePendingTx('testKey'), { wrapper: makeWrapper(connectedValue) })

    await act(async () => {
      await Promise.resolve()
    })

    expect(sessionStorage.getItem('testKey')).toBeNull()
  })

  it('savePendingTx writes hash to sessionStorage', () => {
    const { result } = renderHook(() => usePendingTx('testKey'), {
      wrapper: makeWrapper(connectedValue),
    })
    act(() => {
      result.current.savePendingTx('0xcafebabe')
    })
    expect(sessionStorage.getItem('testKey')).toBe('0xcafebabe')
  })

  it('clearPendingTx removes hash from sessionStorage', () => {
    sessionStorage.setItem('testKey', '0xcafebabe')
    const { result } = renderHook(() => usePendingTx('testKey'), {
      wrapper: makeWrapper(connectedValue),
    })
    act(() => {
      result.current.clearPendingTx()
    })
    expect(sessionStorage.getItem('testKey')).toBeNull()
  })

  it('does not start a second watcher if already watching', async () => {
    sessionStorage.setItem('testKey', '0xdeadbeef')
    let resolveWait!: (value: unknown) => void
    mockWaitForTransaction.mockReturnValue(
      new Promise((r) => {
        resolveWait = r
      }),
    )
    mockRefreshBalances.mockResolvedValue(undefined)

    const { rerender } = renderHook(() => usePendingTx('testKey'), {
      wrapper: makeWrapper(connectedValue),
    })

    rerender()
    rerender()

    resolveWait(undefined)
    await act(async () => {
      await Promise.resolve()
    })

    expect(mockWaitForTransaction).toHaveBeenCalledOnce()
  })
})

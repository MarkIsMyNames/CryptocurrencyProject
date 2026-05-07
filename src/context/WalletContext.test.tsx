import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { ReactNode } from 'react'
import { WalletProvider } from './WalletContext'
import { useWallet } from './useWallet'

const mockGetBalance = vi.fn()
const mockBalanceOf = vi.fn()

const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
const TEST_PK = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'

vi.mock('ethers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ethers')>()
  return {
    ...actual,
    JsonRpcProvider: vi.fn(function MockJRP(this: unknown) {
      return { getBalance: mockGetBalance }
    }),
    Wallet: vi.fn(function MockWallet(this: unknown) {
      return { address: TEST_ADDRESS }
    }),
  }
})

vi.mock('../utils/contract', () => ({
  balanceOf: (...args: unknown[]): Promise<bigint> => mockBalanceOf(...args) as Promise<bigint>,
  decodeContractError: vi.fn((e: unknown) => String(e)),
}))

function wrapper({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>
}

async function renderConnected() {
  vi.useRealTimers()
  mockGetBalance.mockResolvedValue(5000000000000000000n)
  mockBalanceOf.mockResolvedValue(1n)
  const { result } = renderHook(useWallet, { wrapper })
  await act(async () => {
    await result.current.connectWithWallet(TEST_PK)
  })
  return result
}

beforeEach(() => {
  sessionStorage.clear()
  mockGetBalance.mockReset()
  mockBalanceOf.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('refreshBalances', () => {
  it('updates state in one call when no expectedEtk provided', async () => {
    const result = await renderConnected()
    mockGetBalance.mockResolvedValue(2000000000000000000n)
    mockBalanceOf.mockResolvedValue(0n)

    await act(async () => {
      await result.current.refreshBalances()
    })

    expect(result.current.etkBalance).toBe(0n)
    expect(result.current.ethBalance).toBe(2000000000000000000n)
  })

  it('resolves in one call when balance already matches expectedEtk', async () => {
    const result = await renderConnected()
    const balanceOfCallsBefore = mockBalanceOf.mock.calls.length
    mockGetBalance.mockResolvedValue(2000000000000000000n)
    mockBalanceOf.mockResolvedValue(0n)

    await act(async () => {
      await result.current.refreshBalances(0n)
    })

    expect(mockBalanceOf.mock.calls.length - balanceOfCallsBefore).toBe(1)
    expect(result.current.etkBalance).toBe(0n)
  })

  it('retries until balance matches expectedEtk', async () => {
    const result = await renderConnected()
    mockGetBalance.mockResolvedValue(2000000000000000000n)
    // First call still stale, second matches
    mockBalanceOf.mockResolvedValueOnce(1n).mockResolvedValue(0n)

    vi.useFakeTimers()
    await act(async () => {
      const p = result.current.refreshBalances(0n)
      await vi.advanceTimersByTimeAsync(1500)
      await p
    })

    expect(result.current.etkBalance).toBe(0n)
  })

  it('commits last fetched value after exhausting all retries', async () => {
    const result = await renderConnected()
    mockGetBalance.mockResolvedValue(2000000000000000000n)
    // Balance never reaches expected value
    mockBalanceOf.mockResolvedValue(1n)

    vi.useFakeTimers()
    await act(async () => {
      const p = result.current.refreshBalances(0n)
      await vi.advanceTimersByTimeAsync(1500 * 10)
      await p
    })

    expect(result.current.etkBalance).toBe(1n)
  })
})

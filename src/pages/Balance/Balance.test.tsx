import { customRender, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import en from '../../locales/en.json'
import { Balance } from './Balance'

vi.mock('../../context/useWallet', () => ({
  useWallet: vi.fn(),
}))

vi.mock('../../utils/contract', () => ({
  balanceOf: vi.fn().mockResolvedValue(BigInt(1)),
  remainingTickets: vi.fn().mockResolvedValue(BigInt(999)),
  decodeContractError: vi.fn().mockReturnValue(en.errors.unknownError),
}))

vi.mock('ethers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('ethers')>()
  return {
    ...actual,
    JsonRpcProvider: vi.fn(function () {
      return { getBalance: mockGetBalance }
    }),
  }
})

import { useWallet } from '../../context/useWallet'
import { balanceOf, remainingTickets } from '../../utils/contract'

const mockBalanceOf = vi.mocked(balanceOf)
const mockRemainingTickets = vi.mocked(remainingTickets)
const mockGetBalance = vi.fn().mockResolvedValue(BigInt('1500000000000000000'))

const connectedWallet = {
  provider: { getBalance: mockGetBalance },
  address: '0xabc123',
  isConnected: true,
}

const disconnectedWallet = {
  provider: null,
  address: null,
  isConnected: false,
}

const VALID_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'

function checkAddress(address: string) {
  const input = screen.getByPlaceholderText(en.balance.placeholder)
  fireEvent.change(input, { target: { value: address } })
  fireEvent.click(screen.getByText(en.balance.checkBtn))
}

describe('Balance', () => {
  beforeEach(() => {
    vi.mocked(useWallet).mockReturnValue(connectedWallet as unknown as ReturnType<typeof useWallet>)
  })

  it('renders title and subtitle', () => {
    customRender(<Balance />)
    expect(screen.getByText(en.balance.title)).toBeInTheDocument()
    expect(screen.getByText(en.balance.subtitle)).toBeInTheDocument()
  })

  it('renders the address input and check button', () => {
    customRender(<Balance />)
    expect(screen.getByPlaceholderText(en.balance.placeholder)).toBeInTheDocument()
    expect(screen.getByText(en.balance.checkBtn)).toBeInTheDocument()
  })

  it('shows invalid address error for bad input', async () => {
    customRender(<Balance />)
    checkAddress('notanaddress')
    await waitFor(() => {
      expect(screen.getByText(en.balance.invalidAddress)).toBeInTheDocument()
    })
  })

  it('shows SETH balance after checking', async () => {
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
    })
  })

  it('shows valid ticket badge when ETK > 0', async () => {
    mockBalanceOf.mockResolvedValue(BigInt(1))
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketValid)).toBeInTheDocument()
    })
  })

  it('shows no ticket badge when ETK = 0', async () => {
    mockBalanceOf.mockResolvedValue(BigInt(0))
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketNone)).toBeInTheDocument()
    })
  })

  it('shows remaining supply after checking', async () => {
    mockRemainingTickets.mockResolvedValue(BigInt(999))
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/999/)).toBeInTheDocument()
    })
  })

  it('shows unknown error on network failure', async () => {
    mockGetBalance.mockRejectedValueOnce(new Error('network'))
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.unknownError)).toBeInTheDocument()
    })
  })

  it('uses a JsonRpcProvider when no wallet is connected', async () => {
    vi.mocked(useWallet).mockReturnValue(
      disconnectedWallet as unknown as ReturnType<typeof useWallet>,
    )
    const { JsonRpcProvider } = await import('ethers')
    customRender(<Balance />)
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
    })
    expect(JsonRpcProvider).toHaveBeenCalled()
  })
})

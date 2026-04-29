import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { Balance } from './Balance'

const mockGetBalance = vi.fn().mockResolvedValue(BigInt('1500000000000000000'))

const mockWallet = {
  provider: { getBalance: mockGetBalance } as { getBalance: typeof mockGetBalance } | null,
  address: '0xConnectedAddress1234567890abcdef12345678' as string | null,
  isConnected: true,
}

vi.mock('../../context/useWallet', () => ({
  useWallet: () => mockWallet,
}))

vi.mock('../../utils/contract', () => ({
  balanceOf: vi.fn().mockResolvedValue(BigInt(1)),
  remainingTickets: vi.fn().mockResolvedValue(BigInt(999)),
}))

const mockConfig = vi.hoisted(() => ({
  contractAddress: '0xContractAddress1234567890abcdef12345678',
  defaultTicketSupply: 1000,
}))

vi.mock('../../config', () => ({
  config: mockConfig,
}))

import { balanceOf, remainingTickets } from '../../utils/contract'

const mockBalanceOf = vi.mocked(balanceOf)
const mockRemainingTickets = vi.mocked(remainingTickets)

const VALID_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'
const CONNECTED_ADDRESS = '0xConnectedAddress1234567890abcdef12345678'

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <Balance />
    </ThemeProvider>,
  )
}

function checkAddress(address: string) {
  const input = screen.getByPlaceholderText(en.balance.placeholder)
  fireEvent.change(input, { target: { value: address } })
  fireEvent.click(screen.getByRole('button', { name: en.balance.checkBtn }))
}

describe('Balance', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetBalance.mockResolvedValue(BigInt('1500000000000000000'))
    mockBalanceOf.mockResolvedValue(BigInt(1))
    mockRemainingTickets.mockResolvedValue(BigInt(999))
    mockWallet.provider = { getBalance: mockGetBalance }
    mockWallet.address = CONNECTED_ADDRESS
    mockWallet.isConnected = true
    mockConfig.contractAddress = '0xContractAddress1234567890abcdef12345678'
  })

  it('renders title and subtitle', () => {
    renderPage()
    expect(screen.getByText(en.balance.title)).toBeInTheDocument()
    expect(screen.getByText(en.balance.subtitle)).toBeInTheDocument()
  })

  it('renders the address input and check button', () => {
    renderPage()
    expect(screen.getByPlaceholderText(en.balance.placeholder)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: en.balance.checkBtn })).toBeInTheDocument()
  })

  it('pre-fills input with the connected wallet address', () => {
    renderPage()
    expect(screen.getByPlaceholderText(en.balance.placeholder)).toHaveValue(CONNECTED_ADDRESS)
  })

  it('shows invalid address error for bad input', async () => {
    renderPage()
    checkAddress('notanaddress')
    await waitFor(() => {
      expect(screen.getByText(en.balance.invalidAddress)).toBeInTheDocument()
    })
  })

  it('shows invalid address error for empty submission', async () => {
    renderPage()
    fireEvent.change(screen.getByPlaceholderText(en.balance.placeholder), {
      target: { value: '' },
    })
    fireEvent.click(screen.getByRole('button', { name: en.balance.checkBtn }))
    await waitFor(() => {
      expect(screen.getByText(en.balance.invalidAddress)).toBeInTheDocument()
    })
  })

  it('disables button and shows loading indicator while fetching', async () => {
    let resolveBalance!: (v: bigint) => void
    mockGetBalance.mockReturnValueOnce(
      new Promise<bigint>((r) => {
        resolveBalance = r
      }),
    )
    renderPage()
    checkAddress(VALID_ADDRESS)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveTextContent('...')
    resolveBalance(BigInt('1000000000000000000'))
    await waitFor(() => {
      expect(btn).not.toBeDisabled()
      expect(btn).toHaveTextContent(en.balance.checkBtn)
    })
  })

  it('shows SETH balance after checking', async () => {
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
    })
  })

  it('shows ETK ticket count after checking', async () => {
    mockBalanceOf.mockResolvedValueOnce(BigInt(3))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument()
    })
  })

  it('shows valid ticket badge when ETK > 0', async () => {
    mockBalanceOf.mockResolvedValueOnce(BigInt(1))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketValid)).toBeInTheDocument()
    })
  })

  it('shows no ticket badge when ETK = 0', async () => {
    mockBalanceOf.mockResolvedValueOnce(BigInt(0))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketNone)).toBeInTheDocument()
    })
  })

  it('shows remaining supply after checking', async () => {
    mockRemainingTickets.mockResolvedValueOnce(BigInt(999))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/999 \/ 1000/)).toBeInTheDocument()
    })
  })

  it('shows result cards with correct labels', async () => {
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.sethLabel)).toBeInTheDocument()
      expect(screen.getByText(en.balance.etkLabel)).toBeInTheDocument()
      expect(screen.getByText(en.balance.supplyLabel)).toBeInTheDocument()
    })
  })

  it('clears previous error when a new valid check succeeds', async () => {
    renderPage()
    checkAddress('notanaddress')
    await waitFor(() => {
      expect(screen.getByText(en.balance.invalidAddress)).toBeInTheDocument()
    })
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.queryByText(en.balance.invalidAddress)).not.toBeInTheDocument()
    })
  })

  it('shows unknown error when getBalance rejects', async () => {
    mockGetBalance.mockRejectedValueOnce(new Error('network'))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.unknownError)).toBeInTheDocument()
    })
  })

  it('shows unknown error when balanceOf rejects', async () => {
    mockBalanceOf.mockRejectedValueOnce(new Error('contract error'))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.unknownError)).toBeInTheDocument()
    })
  })

  it('shows unknown error when remainingTickets rejects', async () => {
    mockRemainingTickets.mockRejectedValueOnce(new Error('contract error'))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.unknownError)).toBeInTheDocument()
    })
  })

  it('shows connect wallet error when provider is null', async () => {
    mockWallet.provider = null
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.connectWallet)).toBeInTheDocument()
    })
  })

  it('shows SETH balance and 0 ETK when contract address is not configured', async () => {
    mockConfig.contractAddress = ''
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
      expect(screen.getByText(en.balance.ticketNone)).toBeInTheDocument()
    })
    expect(mockBalanceOf).not.toHaveBeenCalled()
    expect(mockRemainingTickets).not.toHaveBeenCalled()
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { Balance } from './Balance'

vi.mock('../../context/useWallet', () => ({
  useWallet: () => ({
    provider: { getBalance: mockGetBalance },
    address: '0xabc123',
    isConnected: true,
  }),
}))

vi.mock('../../utils/contract', () => ({
  balanceOf: vi.fn().mockResolvedValue(BigInt(1)),
  remainingTickets: vi.fn().mockResolvedValue(BigInt(999)),
}))

import { balanceOf, remainingTickets } from '../../utils/contract'

const mockBalanceOf = vi.mocked(balanceOf)
const mockRemainingTickets = vi.mocked(remainingTickets)
const mockGetBalance = vi.fn().mockResolvedValue(BigInt('1500000000000000000'))

const VALID_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'

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
  fireEvent.click(screen.getByText(en.balance.checkBtn))
}

describe('Balance', () => {
  it('renders title and subtitle', () => {
    renderPage()
    expect(screen.getByText(en.balance.title)).toBeInTheDocument()
    expect(screen.getByText(en.balance.subtitle)).toBeInTheDocument()
  })

  it('renders the address input and check button', () => {
    renderPage()
    expect(screen.getByPlaceholderText(en.balance.placeholder)).toBeInTheDocument()
    expect(screen.getByText(en.balance.checkBtn)).toBeInTheDocument()
  })

  it('shows invalid address error for bad input', async () => {
    renderPage()
    checkAddress('notanaddress')
    await waitFor(() => {
      expect(screen.getByText(en.balance.invalidAddress)).toBeInTheDocument()
    })
  })

  it('shows SETH balance after checking', async () => {
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
    })
  })

  it('shows valid ticket badge when ETK > 0', async () => {
    mockBalanceOf.mockResolvedValue(BigInt(1))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketValid)).toBeInTheDocument()
    })
  })

  it('shows no ticket badge when ETK = 0', async () => {
    mockBalanceOf.mockResolvedValue(BigInt(0))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.balance.ticketNone)).toBeInTheDocument()
    })
  })

  it('shows remaining supply after checking', async () => {
    mockRemainingTickets.mockResolvedValue(BigInt(999))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(/999/)).toBeInTheDocument()
    })
  })

  it('shows unknown error on network failure', async () => {
    mockGetBalance.mockRejectedValueOnce(new Error('network'))
    renderPage()
    checkAddress(VALID_ADDRESS)
    await waitFor(() => {
      expect(screen.getByText(en.errors.unknownError)).toBeInTheDocument()
    })
  })
})

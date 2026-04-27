import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import { BuyTicket } from './BuyTicket'

const mockBuyTicket = vi.fn()
const mockGetContract = vi.fn(() => ({
  buyTicket: mockBuyTicket,
  remainingTickets: vi.fn().mockResolvedValue(BigInt(950)),
  balanceOf: vi.fn().mockResolvedValue(BigInt(0)),
}))

vi.mock('../../utils/contract', () => ({
  getContract: () => mockGetContract(),
  decodeContractError: vi.fn().mockReturnValue('unknownError'),
}))

vi.mock('../../context/WalletContext', () => ({
  useWallet: () => ({
    signer: {},
    provider: {},
    address: '0xabc123',
    isConnected: true,
    refreshBalances: vi.fn(),
  }),
}))

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <BuyTicket />
    </ThemeProvider>,
  )
}

describe('BuyTicket', () => {
  it('renders ticket price and buy button', () => {
    renderPage()
    expect(screen.getByText('Buy Ticket')).toBeInTheDocument()
    expect(screen.getByText(/0\.01 SETH/)).toBeInTheDocument()
  })

  it('shows pending state during transaction', async () => {
    mockBuyTicket.mockImplementation(() => new Promise(() => {}))
    renderPage()
    await waitFor(() => screen.getByText('Buy Ticket'))
    fireEvent.click(screen.getByText('Buy Ticket'))
    await waitFor(() => {
      expect(screen.getByText('Transaction pending...')).toBeInTheDocument()
    })
  })

  it('shows success message after purchase', async () => {
    mockBuyTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    renderPage()
    await waitFor(() => screen.getByText('Buy Ticket'))
    fireEvent.click(screen.getByText('Buy Ticket'))
    await waitFor(() => {
      expect(screen.getByText('Ticket purchased successfully!')).toBeInTheDocument()
    })
  })
})

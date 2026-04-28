import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { BuyTicket } from './BuyTicket'

const mockBuyTicket = vi.fn()

vi.mock('../../utils/contract', () => ({
  buyTicket: (...args: unknown[]) => mockBuyTicket(...args) as unknown,
  remainingTickets: vi.fn().mockResolvedValue(BigInt(950)),
  balanceOf: vi.fn().mockResolvedValue(BigInt(0)),
  decodeContractError: vi.fn().mockReturnValue('unknownError'),
}))

vi.mock('../../context/useWallet', () => ({
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
    expect(screen.getByText(en.buyTicket.buyBtn)).toBeInTheDocument()
    expect(screen.getByText(/0\.01 SETH/)).toBeInTheDocument()
  })

  it('shows pending state during transaction', async () => {
    mockBuyTicket.mockImplementation(() => new Promise(() => {}))
    renderPage()
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(screen.getByText(en.buyTicket.pending)).toBeInTheDocument()
    })
  })

  it('shows success message after purchase', async () => {
    mockBuyTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    renderPage()
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(screen.getByText(en.buyTicket.success)).toBeInTheDocument()
    })
  })

  it('shows connect prompt when wallet not connected', () => {
    vi.doMock('../../context/WalletContext', () => ({
      useWallet: () => ({
        signer: null,
        provider: null,
        address: null,
        isConnected: false,
        refreshBalances: vi.fn(),
      }),
    }))
    renderPage()
    expect(screen.getByText(en.buyTicket.buyBtn)).toBeInTheDocument()
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { RedeemTicket } from './RedeemTicket'

const mockRedeemTicket = vi.hoisted(() => vi.fn())
const mockUseWallet = vi.hoisted(() => vi.fn())

vi.mock('../../utils/contract', () => ({
  redeemTicket: mockRedeemTicket,
  decodeContractError: vi.fn().mockReturnValue(en.redeem.noTicketError),
}))

vi.mock('../../context/useWallet', () => ({
  useWallet: mockUseWallet,
}))

const connectedWallet = {
  signer: {},
  provider: {},
  address: '0xabc123',
  isConnected: true,
  isConnecting: false,
  ethBalance: null,
  etkBalance: BigInt(1),
  error: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  connectWithWallet: vi.fn(),
  refreshBalances: vi.fn(),
}

beforeEach(() => {
  mockUseWallet.mockReturnValue(connectedWallet)
})

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <RedeemTicket />
    </ThemeProvider>,
  )
}

describe('RedeemTicket', () => {
  it('shows connect prompt when not connected', () => {
    mockUseWallet.mockReturnValueOnce({ ...connectedWallet, isConnected: false })
    renderPage()
    expect(screen.getByText(en.redeem.connectFirst)).toBeInTheDocument()
  })

  it('shows wallet address when connected', () => {
    renderPage()
    expect(screen.getByText('0xabc123')).toBeInTheDocument()
  })

  it('shows valid ticket status when etkBalance > 0', () => {
    renderPage()
    expect(screen.getByText(en.redeem.hasTicket)).toBeInTheDocument()
  })

  it('shows no ticket status when etkBalance is 0', () => {
    mockUseWallet.mockReturnValueOnce({ ...connectedWallet, etkBalance: BigInt(0) })
    renderPage()
    expect(screen.getByText(en.redeem.noTicket)).toBeInTheDocument()
  })

  it('disables redeem button when no ticket', () => {
    mockUseWallet.mockReturnValueOnce({ ...connectedWallet, etkBalance: BigInt(0) })
    renderPage()
    expect(screen.getByText(en.redeem.redeemBtn)).toBeDisabled()
  })

  it('renders redeem button when connected with ticket', () => {
    renderPage()
    expect(screen.getByText(en.redeem.redeemBtn)).toBeInTheDocument()
    expect(screen.getByText(en.redeem.redeemBtn)).not.toBeDisabled()
  })

  it('shows pending state during redemption', async () => {
    mockRedeemTicket.mockImplementation(() => new Promise(() => {}))
    renderPage()
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.pending)).toBeInTheDocument()
    })
  })

  it('shows success message after redemption', async () => {
    mockRedeemTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    renderPage()
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.success)).toBeInTheDocument()
    })
  })

  it('shows no-ticket error when wallet has no ETK', async () => {
    mockRedeemTicket.mockRejectedValue(new Error('NoTicketToRedeem'))
    renderPage()
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.noTicketError)).toBeInTheDocument()
    })
  })
})

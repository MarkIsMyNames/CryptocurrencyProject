import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import { RedeemTicket } from './RedeemTicket'

const mockRedeemTicket = vi.fn()

vi.mock('../../utils/contract', () => ({
  getContract: () => ({
    redeemTicket: mockRedeemTicket,
    balanceOf: vi.fn().mockResolvedValue(BigInt(1)),
  }),
  decodeContractError: vi.fn().mockReturnValue('noTicketError'),
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
      <RedeemTicket />
    </ThemeProvider>,
  )
}

describe('RedeemTicket', () => {
  it('renders redeem button when connected', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Redeem at Door')).toBeInTheDocument()
    })
  })

  it('shows success message after redemption', async () => {
    mockRedeemTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    renderPage()
    await waitFor(() => screen.getByText('Redeem at Door'))
    fireEvent.click(screen.getByText('Redeem at Door'))
    await waitFor(() => {
      expect(screen.getByText('Entry confirmed. Enjoy the event!')).toBeInTheDocument()
    })
  })

  it('shows no-ticket error when wallet has no ETK', async () => {
    mockRedeemTicket.mockRejectedValue(new Error('NoTicketToRedeem'))
    renderPage()
    await waitFor(() => screen.getByText('Redeem at Door'))
    fireEvent.click(screen.getByText('Redeem at Door'))
    await waitFor(() => {
      expect(screen.getByText('No ticket found in this wallet.')).toBeInTheDocument()
    })
  })
})

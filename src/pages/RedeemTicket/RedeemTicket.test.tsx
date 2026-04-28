import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { RedeemTicket } from './RedeemTicket'

const mockRedeemTicket = vi.hoisted(() => vi.fn())

vi.mock('../../utils/contract', () => ({
  redeemTicket: mockRedeemTicket,
  decodeContractError: vi.fn().mockReturnValue(en.redeem.noTicketError),
}))

vi.mock('../../context/useWallet', () => ({
  useWallet: () => ({
    signer: {},
    provider: {},
    address: '0xabc123',
    isConnected: true,
    etkBalance: BigInt(1),
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
      expect(screen.getByText(en.redeem.redeemBtn)).toBeInTheDocument()
    })
  })

  it('shows success message after redemption', async () => {
    mockRedeemTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    renderPage()
    await waitFor(() => screen.getByText(en.redeem.redeemBtn))
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.success)).toBeInTheDocument()
    })
  })

  it('shows no-ticket error when wallet has no ETK', async () => {
    mockRedeemTicket.mockRejectedValue(new Error('NoTicketToRedeem'))
    renderPage()
    await waitFor(() => screen.getByText(en.redeem.redeemBtn))
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.noTicketError)).toBeInTheDocument()
    })
  })
})

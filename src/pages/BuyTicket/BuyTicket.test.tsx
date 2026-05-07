import { customRender, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import en from '../../locales/en.json'
import { BuyTicket } from './BuyTicket'

const mockBuyTicket = vi.hoisted(() => vi.fn())
const mockUseWallet = vi.hoisted(() => vi.fn())

vi.mock('../../utils/contract', () => ({
  buyTicket: mockBuyTicket,
  remainingTickets: vi.fn().mockResolvedValue(BigInt(950)),
  decodeContractError: vi.fn().mockReturnValue('unknownError'),
}))

vi.mock('../../context/useWallet', () => ({
  useWallet: mockUseWallet,
  useConnectedWallet: mockUseWallet,
}))

const connectedWallet = {
  signer: {},
  provider: {},
  address: '0xabc',
  isConnected: true,
  isConnecting: false,
  ethBalance: null,
  etkBalance: BigInt(0),
  error: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  connectWithWallet: vi.fn(),
  refreshBalances: vi.fn(),
}

beforeEach(() => {
  mockUseWallet.mockReturnValue(connectedWallet)
})

describe('BuyTicket', () => {
  it('renders ticket price and buy button', () => {
    customRender(<BuyTicket />)
    expect(screen.getByText(en.buyTicket.buyBtn)).toBeInTheDocument()
    expect(screen.getByText(/0\.01 SETH/)).toBeInTheDocument()
  })

  it('shows connect prompt when wallet not connected', () => {
    mockUseWallet.mockReturnValueOnce({
      ...connectedWallet,
      isConnected: false,
      signer: null,
      provider: null,
    })
    customRender(<BuyTicket />)
    expect(screen.getByText(en.buyTicket.connectFirst)).toBeInTheDocument()
  })

  it('shows pending state during transaction', async () => {
    mockBuyTicket.mockImplementation(() => new Promise(() => {}))
    customRender(<BuyTicket />)
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(screen.getByText(en.buyTicket.pending)).toBeInTheDocument()
    })
  })

  it('shows success message after purchase', async () => {
    mockBuyTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    customRender(<BuyTicket />)
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(screen.getByText(en.buyTicket.success)).toBeInTheDocument()
    })
  })

  it('calls refreshBalances with 1n after successful purchase', async () => {
    const mockRefresh = vi.fn().mockResolvedValue(undefined)
    mockUseWallet.mockReturnValue({ ...connectedWallet, refreshBalances: mockRefresh })
    mockBuyTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    customRender(<BuyTicket />)
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledWith(1n)
    })
  })

  it('shows error message on failed purchase', async () => {
    mockBuyTicket.mockRejectedValue(new Error('tx failed'))
    customRender(<BuyTicket />)
    await waitFor(() => screen.getByText(en.buyTicket.buyBtn))
    fireEvent.click(screen.getByText(en.buyTicket.buyBtn))
    await waitFor(() => {
      expect(screen.getByText('unknownError')).toBeInTheDocument()
    })
  })

  it('disables buy button when already owns a ticket', () => {
    const withTicket = { ...connectedWallet, etkBalance: BigInt(1) }
    mockUseWallet.mockReturnValueOnce(withTicket).mockReturnValueOnce(withTicket)
    customRender(<BuyTicket />)
    expect(screen.getByText(en.buyTicket.buyBtn)).toBeDisabled()
  })
})

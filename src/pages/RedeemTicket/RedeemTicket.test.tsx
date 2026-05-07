import { customRender, screen, fireEvent, waitFor } from '../../test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
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
  useConnectedWallet: mockUseWallet,
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

describe('RedeemTicket', () => {
  it('shows connect prompt when not connected', () => {
    mockUseWallet.mockReturnValueOnce({ ...connectedWallet, isConnected: false })
    customRender(<RedeemTicket />)
    expect(screen.getByText(en.redeem.connectFirst)).toBeInTheDocument()
  })

  it('shows wallet address when connected', () => {
    customRender(<RedeemTicket />)
    expect(screen.getByText('0xabc123')).toBeInTheDocument()
  })

  it('shows valid ticket status when etkBalance > 0', () => {
    customRender(<RedeemTicket />)
    expect(screen.getByText(en.redeem.hasTicket)).toBeInTheDocument()
  })

  it('shows no ticket status when etkBalance is 0', () => {
    const noTicket = { ...connectedWallet, etkBalance: BigInt(0) }
    mockUseWallet.mockReturnValueOnce(noTicket).mockReturnValueOnce(noTicket)
    customRender(<RedeemTicket />)
    expect(screen.getByText(en.redeem.noTicket)).toBeInTheDocument()
  })

  it('disables redeem button when no ticket', () => {
    const noTicket = { ...connectedWallet, etkBalance: BigInt(0) }
    mockUseWallet.mockReturnValueOnce(noTicket).mockReturnValueOnce(noTicket)
    customRender(<RedeemTicket />)
    expect(screen.getByText(en.redeem.redeemBtn)).toBeDisabled()
  })

  it('renders redeem button when connected with ticket', () => {
    customRender(<RedeemTicket />)
    expect(screen.getByText(en.redeem.redeemBtn)).toBeInTheDocument()
    expect(screen.getByText(en.redeem.redeemBtn)).not.toBeDisabled()
  })

  it('shows pending state during redemption', async () => {
    mockRedeemTicket.mockImplementation(() => new Promise(() => {}))
    customRender(<RedeemTicket />)
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.pending)).toBeInTheDocument()
    })
  })

  it('shows success message after redemption', async () => {
    mockRedeemTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    customRender(<RedeemTicket />)
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.success)).toBeInTheDocument()
    })
  })

  it('calls refreshBalances after successful redemption', async () => {
    const mockRefresh = vi.fn().mockResolvedValue(undefined)
    mockUseWallet.mockReturnValue({ ...connectedWallet, refreshBalances: mockRefresh })
    mockRedeemTicket.mockResolvedValue({ wait: vi.fn().mockResolvedValue({}) })
    customRender(<RedeemTicket />)
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledOnce()
    })
  })

  it('shows no-ticket error when wallet has no ETK', async () => {
    mockRedeemTicket.mockRejectedValue(new Error('NoTicketToRedeem'))
    customRender(<RedeemTicket />)
    fireEvent.click(screen.getByText(en.redeem.redeemBtn))
    await waitFor(() => {
      expect(screen.getByText(en.redeem.noTicketError)).toBeInTheDocument()
    })
  })
})

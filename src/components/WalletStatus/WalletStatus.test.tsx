import { customRender, screen, fireEvent } from '../../test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import en from '../../locales/en.json'
import { WalletStatus } from './WalletStatus'

vi.mock('../../context/useWallet', () => ({
  useWallet: vi.fn(),
}))

import { useWallet } from '../../context/useWallet'

const base = {
  isConnected: false,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnecting: false,
  error: null,
  provider: null,
  signer: null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  connectWithWallet: vi.fn(),
  refreshBalances: vi.fn(),
}

describe('WalletStatus', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows disconnected label when no wallet connected', () => {
    vi.mocked(useWallet).mockReturnValue(base)
    customRender(<WalletStatus />)
    expect(screen.getByText(en.walletStatus.disconnected)).toBeInTheDocument()
  })

  it('throws when connected but address is null', () => {
    vi.mocked(useWallet).mockReturnValue({ ...base, isConnected: true, address: null })
    expect(() => customRender(<WalletStatus />)).toThrow(en.errors.connectedNoAddress)
  })

  it('shows truncated address when connected', () => {
    vi.mocked(useWallet).mockReturnValue({
      ...base,
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      ethBalance: BigInt('1000000000000000000'),
      etkBalance: BigInt(1),
    })
    customRender(<WalletStatus />)
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument()
  })

  it('copies address to clipboard and shows copied feedback on click', async () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    vi.mocked(useWallet).mockReturnValue({ ...base, isConnected: true, address })
    const writeText = vi.fn().mockResolvedValue(undefined)
    vi.stubGlobal('navigator', { clipboard: { writeText } })

    customRender(<WalletStatus />)
    fireEvent.click(screen.getByRole('button'))

    expect(writeText).toHaveBeenCalledWith(address)
    expect(await screen.findByText(en.walletStatus.copied)).toBeInTheDocument()
  })

  it('does not render a button when disconnected', () => {
    vi.mocked(useWallet).mockReturnValue(base)
    customRender(<WalletStatus />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

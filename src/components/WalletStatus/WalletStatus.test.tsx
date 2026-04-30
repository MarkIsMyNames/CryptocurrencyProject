import { customRender, screen } from '../../test-utils'
import { describe, it, expect, vi } from 'vitest'
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
})

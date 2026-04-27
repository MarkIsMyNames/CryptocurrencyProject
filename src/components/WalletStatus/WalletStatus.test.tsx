import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { WalletStatus } from './WalletStatus'

vi.mock('../../context/WalletContext', () => ({
  useWallet: vi.fn(),
}))

import { useWallet } from '../../context/WalletContext'

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
  refreshBalances: vi.fn(),
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('WalletStatus', () => {
  it('shows disconnected label when no wallet connected', () => {
    vi.mocked(useWallet).mockReturnValue(base)
    renderWithTheme(<WalletStatus />)
    expect(screen.getByText(en.walletStatus.disconnected)).toBeInTheDocument()
  })

  it('shows truncated address when connected', () => {
    vi.mocked(useWallet).mockReturnValue({
      ...base,
      isConnected: true,
      address: '0x1234567890abcdef1234567890abcdef12345678',
      ethBalance: BigInt('1000000000000000000'),
      etkBalance: BigInt(1),
    })
    renderWithTheme(<WalletStatus />)
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument()
  })

  it('shows disconnected label when connected but no address', () => {
    vi.mocked(useWallet).mockReturnValue({ ...base, isConnected: true, address: null })
    renderWithTheme(<WalletStatus />)
    expect(screen.getByText(en.walletStatus.disconnected)).toBeInTheDocument()
  })
})

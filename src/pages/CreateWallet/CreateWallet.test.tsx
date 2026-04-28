import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import * as walletUtils from '../../utils/wallet'
import { CreateWallet } from './CreateWallet'

vi.mock('../../context/useWallet', () => ({
  useWallet: () => ({
    connect: vi.fn(),
    isConnected: false,
    isConnecting: false,
    error: null,
  }),
}))

vi.mock('../../utils/wallet', () => ({
  generateWallet: vi.fn(),
  downloadKeystore: vi.fn(),
}))

function renderPage() {
  return render(
    <MemoryRouter>
      <ThemeProvider theme={theme}>
        <CreateWallet />
      </ThemeProvider>
    </MemoryRouter>,
  )
}

describe('CreateWallet', () => {
  beforeEach(() => {
    vi.mocked(walletUtils.generateWallet).mockReturnValue({
      address: '0xabc123',
      privateKey: '0xprivatekey',
      mnemonic: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
    })
  })

  it('renders both action buttons', () => {
    renderPage()
    expect(screen.getByText(en.createWallet.generateBtn)).toBeInTheDocument()
    expect(screen.getByText(en.createWallet.connectBtn)).toBeInTheDocument()
  })

  it('displays wallet details after generation', async () => {
    renderPage()
    fireEvent.click(screen.getByText(en.createWallet.generateBtn))
    await waitFor(() => {
      expect(screen.getByText('0xabc123')).toBeInTheDocument()
    })
  })

  it('shows download keystore button after generation', async () => {
    renderPage()
    fireEvent.click(screen.getByText(en.createWallet.generateBtn))
    await waitFor(() => {
      expect(screen.getByText(en.createWallet.downloadBtn)).toBeInTheDocument()
    })
  })

  it('shows security warning after generation', async () => {
    renderPage()
    fireEvent.click(screen.getByText(en.createWallet.generateBtn))
    await waitFor(() => {
      expect(screen.getByText(en.createWallet.warning)).toBeInTheDocument()
    })
  })

  it('toggles private key visibility', async () => {
    renderPage()
    fireEvent.click(screen.getByText(en.createWallet.generateBtn))
    await waitFor(() => screen.getByText(en.createWallet.revealKey))
    fireEvent.click(screen.getByText(en.createWallet.revealKey))
    expect(screen.getByText(en.createWallet.hideKey)).toBeInTheDocument()
  })
})

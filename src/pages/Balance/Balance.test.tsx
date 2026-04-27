import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import { Balance } from './Balance'

vi.mock('../../context/WalletContext', () => ({
  useWallet: () => ({
    provider: {
      getBalance: vi.fn().mockResolvedValue(BigInt('1500000000000000000')),
    },
    address: '0xabc123',
    isConnected: true,
  }),
}))

vi.mock('../../utils/contract', () => ({
  getContract: () => ({
    balanceOf: vi.fn().mockResolvedValue(BigInt(1)),
    remainingTickets: vi.fn().mockResolvedValue(BigInt(999)),
  }),
}))

function renderPage() {
  return render(
    <ThemeProvider theme={theme}>
      <Balance />
    </ThemeProvider>,
  )
}

describe('Balance', () => {
  it('renders the address input', () => {
    renderPage()
    expect(screen.getByPlaceholderText(/Enter wallet address/)).toBeInTheDocument()
  })

  it('shows SETH and ETK balances after checking', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Enter wallet address/)
    fireEvent.change(input, { target: { value: '0x1234567890abcdef1234567890abcdef12345678' } })
    fireEvent.click(screen.getByText('Check Balance'))
    await waitFor(() => {
      expect(screen.getByText(/1\.5/)).toBeInTheDocument()
    })
  })

  it('shows invalid address error for bad input', async () => {
    renderPage()
    const input = screen.getByPlaceholderText(/Enter wallet address/)
    fireEvent.change(input, { target: { value: 'notanaddress' } })
    fireEvent.click(screen.getByText('Check Balance'))
    await waitFor(() => {
      expect(screen.getByText(/valid Ethereum address/)).toBeInTheDocument()
    })
  })
})

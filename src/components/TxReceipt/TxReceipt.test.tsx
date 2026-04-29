import { render, screen } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { TxReceipt } from './TxReceipt'

const HASH = '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd'

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>)
}

describe('TxReceipt', () => {
  it('displays the transaction hash', () => {
    renderWithTheme(<TxReceipt hash={HASH} />)
    expect(screen.getByText(HASH)).toBeInTheDocument()
  })

  it('displays the label', () => {
    renderWithTheme(<TxReceipt hash={HASH} />)
    expect(screen.getByText(en.txReceipt.txHashLabel)).toBeInTheDocument()
  })

  it('renders an Etherscan link with the correct href', () => {
    renderWithTheme(<TxReceipt hash={HASH} />)
    const link = screen.getByRole('link', { name: en.txReceipt.viewOnEtherscan })
    expect(link).toHaveAttribute('href', `https://sepolia.etherscan.io/tx/${HASH}`)
  })

  it('opens the link in a new tab', () => {
    renderWithTheme(<TxReceipt hash={HASH} />)
    const link = screen.getByRole('link', { name: en.txReceipt.viewOnEtherscan })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})

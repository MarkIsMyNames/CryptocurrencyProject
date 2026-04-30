import { customRender, screen } from '../../test-utils'
import { describe, it, expect } from 'vitest'
import en from '../../locales/en.json'
import { TxReceipt } from './TxReceipt'

const HASH = '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd'

describe('TxReceipt', () => {
  it('displays the transaction hash', () => {
    customRender(<TxReceipt hash={HASH} />)
    expect(screen.getByText(HASH)).toBeInTheDocument()
  })

  it('displays the label', () => {
    customRender(<TxReceipt hash={HASH} />)
    expect(screen.getByText(en.txReceipt.txHashLabel)).toBeInTheDocument()
  })

  it('renders an Etherscan link with the correct href', () => {
    customRender(<TxReceipt hash={HASH} />)
    const link = screen.getByRole('link', { name: en.txReceipt.viewOnEtherscan })
    expect(link).toHaveAttribute('href', `https://sepolia.etherscan.io/tx/${HASH}`)
  })

  it('opens the link in a new tab', () => {
    customRender(<TxReceipt hash={HASH} />)
    const link = screen.getByRole('link', { name: en.txReceipt.viewOnEtherscan })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })
})

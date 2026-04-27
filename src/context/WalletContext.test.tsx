import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WalletProvider, useWallet } from './WalletContext'

function TestConsumer() {
  const { address, isConnected, ethBalance, etkBalance } = useWallet()
  return (
    <div>
      <span data-testid="address">{address ?? 'none'}</span>
      <span data-testid="connected">{isConnected ? 'yes' : 'no'}</span>
      <span data-testid="ethBalance">{ethBalance?.toString() ?? 'null'}</span>
      <span data-testid="etkBalance">{etkBalance?.toString() ?? 'null'}</span>
    </div>
  )
}

describe('WalletContext', () => {
  it('provides default disconnected state', () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>,
    )
    expect(screen.getByTestId('address').textContent).toBe('none')
    expect(screen.getByTestId('connected').textContent).toBe('no')
  })

  it('provides null balances by default', () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>,
    )
    expect(screen.getByTestId('ethBalance').textContent).toBe('null')
    expect(screen.getByTestId('etkBalance').textContent).toBe('null')
  })

  it('throws when useWallet is used outside WalletProvider', () => {
    const original = console.error
    console.error = () => {}
    expect(() => render(<TestConsumer />)).toThrow('useWallet must be used inside WalletProvider')
    console.error = original
  })
})

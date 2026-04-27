import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { WalletProvider, useWallet } from './WalletContext'

function TestConsumer() {
  const { address, isConnected } = useWallet()
  return (
    <div>
      <span data-testid="address">{address ?? 'none'}</span>
      <span data-testid="connected">{isConnected ? 'yes' : 'no'}</span>
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
})

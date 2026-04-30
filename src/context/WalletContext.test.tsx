import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { WalletProvider } from './WalletContext'
import { useWallet, useConnectedWallet } from './useWallet'
import strings from '../locales/en.json'

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

function ConnectedConsumer() {
  useConnectedWallet()
  return null
}

describe('WalletContext', () => {
  it('provides default disconnected state with null balances', () => {
    render(
      <WalletProvider>
        <TestConsumer />
      </WalletProvider>,
    )
    expect(screen.getByTestId('address').textContent).toBe('none')
    expect(screen.getByTestId('connected').textContent).toBe('no')
    expect(screen.getByTestId('ethBalance').textContent).toBe('null')
    expect(screen.getByTestId('etkBalance').textContent).toBe('null')
  })

  it('throws when useWallet is used outside WalletProvider', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<TestConsumer />)).toThrow(strings.errors.hookOutsideProvider)
    vi.restoreAllMocks()
  })

  it('throws when useConnectedWallet is used in disconnected state', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <WalletProvider>
          <ConnectedConsumer />
        </WalletProvider>,
      ),
    ).toThrow(strings.errors.notConnected)
    vi.restoreAllMocks()
  })
})

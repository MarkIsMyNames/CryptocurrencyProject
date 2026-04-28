import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext, type WalletContextValue } from '../../context/walletContext'
import { Balance } from './Balance'

const base: WalletContextValue = {
  isConnected: false,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnecting: false,
  error: null,
  provider: null,
  signer: null,
  connect: () => Promise.resolve(),
  disconnect: () => {},
  connectWithWallet: () => Promise.resolve(true),
  refreshBalances: () => Promise.resolve(),
}

export default {
  component: Balance,
  args: base,
  decorators: [
    (Story, { args }) => (
      <WalletContext.Provider value={args}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
} satisfies Meta<WalletContextValue>

type Story = StoryObj<WalletContextValue>

export const Disconnected: Story = {}

export const ConnectedWallet: Story = {
  args: {
    isConnected: true,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    ethBalance: BigInt('1500000000000000000'),
    etkBalance: BigInt(1),
  },
}

export const ButtonHover: Story = {
  parameters: { pseudo: { hover: 'button' } },
}

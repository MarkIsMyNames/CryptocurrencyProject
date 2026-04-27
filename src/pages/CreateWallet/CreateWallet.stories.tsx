import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext, type WalletContextValue } from '../../context/WalletContext'
import { CreateWallet } from './CreateWallet'

const base: WalletContextValue = {
  provider: null,
  signer: null,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connect: () => Promise.resolve(),
  disconnect: () => {},
  refreshBalances: () => Promise.resolve(),
}

export default {
  component: CreateWallet,
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

export const Default: Story = {}

export const Connecting: Story = {
  args: { isConnecting: true },
}

export const ButtonFocus: Story = {
  parameters: { pseudo: { focus: true } },
}

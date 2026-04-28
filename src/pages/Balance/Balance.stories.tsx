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

export const Default: Story = {}

export const InputFocus: Story = {
  parameters: { pseudo: { focus: 'input' } },
}

export const ButtonHover: Story = {
  parameters: { pseudo: { hover: 'button' } },
}

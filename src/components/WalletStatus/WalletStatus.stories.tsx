import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletStatus } from './WalletStatus'
import { WalletContext, type WalletContextValue } from '../../context/WalletContext'

const base: WalletContextValue = {
  isConnected: false,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnecting: false,
  error: null,
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
  refreshBalances: async () => {},
}

export default {
  component: WalletStatus,
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

export const Connected: Story = {
  args: {
    isConnected: true,
    address: '0x1234567890abcdef1234567890abcdef12345678',
    ethBalance: BigInt('1000000000000000000'),
    etkBalance: BigInt(1),
  },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import strings from '../../locales/en.json'
import { WalletStatus } from './WalletStatus'
import { WalletContext, type WalletContextValue } from '../../context/useWallet'

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

export const WithError: Story = {
  args: {
    error: strings.createWallet.metaMaskNotFound,
  },
}

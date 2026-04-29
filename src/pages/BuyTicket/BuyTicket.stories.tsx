import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext, type WalletContextValue } from '../../context/walletContext'
import { BuyTicket, TxReceipt } from './BuyTicket'

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
  component: BuyTicket,
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

export const Connected: Story = {
  args: { isConnected: true, address: '0xabc123', signer: {} as never },
}

export const ButtonHover: Story = {
  args: { isConnected: true, address: '0xabc123', signer: {} as never },
  parameters: { pseudo: { hover: true } },
}

export const NotConnected: Story = {
  args: { isConnected: false },
}

export const Success: Story = {
  render: () => (
    <TxReceipt hash="0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd" />
  ),
}

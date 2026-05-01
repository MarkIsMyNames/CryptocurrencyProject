import type { Meta, StoryObj } from '@storybook/react-vite'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { WalletContext, type WalletContextValue } from '../../context/useWallet'
import { BuyTicket } from './BuyTicket'

const base: WalletContextValue = {
  isConnected: false,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnecting: false,
  error: null,
  provider: null,
  signer: null,
  connect: () => Promise.resolve(false),
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

const mockProvider = {
  resolveName: (name: string) => Promise.resolve(name),
  getNetwork: () => Promise.resolve({ chainId: 11155111n }),
  call: () => Promise.resolve('0x0000000000000000000000000000000000000000000000000000000000000064'),
} as unknown as BrowserProvider

export const Connected: Story = {
  args: {
    isConnected: true,
    address: '0xabc123',
    signer: {} as unknown as JsonRpcSigner,
    provider: mockProvider,
  },
}

export const ButtonHover: Story = {
  args: {
    isConnected: true,
    address: '0xabc123',
    signer: {} as unknown as JsonRpcSigner,
    provider: mockProvider,
  },
  parameters: { pseudo: { hover: true } },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext } from '../../context/WalletContext'
import { BuyTicket } from './BuyTicket'

const baseWalletCtx = {
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

const meta: Meta<typeof BuyTicket> = {
  title: 'Pages/BuyTicket',
  component: BuyTicket,
  decorators: [
    (Story) => (
      <WalletContext.Provider value={baseWalletCtx}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof BuyTicket>

export const Default: Story = {}

export const Connected: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider
        value={{
          ...baseWalletCtx,
          isConnected: true,
          address: '0xabc123',
          provider: null,
          signer: {} as never,
        }}
      >
        <Story />
      </WalletContext.Provider>
    ),
  ],
}

export const ButtonHover: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider
        value={{
          ...baseWalletCtx,
          isConnected: true,
          address: '0xabc123',
          provider: null,
          signer: {} as never,
        }}
      >
        <Story />
      </WalletContext.Provider>
    ),
  ],
  parameters: { pseudo: { hover: 'button' } },
}

export const ButtonFocus: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider
        value={{
          ...baseWalletCtx,
          isConnected: true,
          address: '0xabc123',
          provider: null,
          signer: {} as never,
        }}
      >
        <Story />
      </WalletContext.Provider>
    ),
  ],
  parameters: { pseudo: { focus: 'button' } },
}

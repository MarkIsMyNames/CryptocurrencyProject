import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext } from '../../context/WalletContext'
import { RedeemTicket } from './RedeemTicket'

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

const meta: Meta<typeof RedeemTicket> = {
  title: 'Pages/RedeemTicket',
  component: RedeemTicket,
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

type Story = StoryObj<typeof RedeemTicket>

export const Default: Story = {}

export const HasTicket: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider
        value={{
          ...baseWalletCtx,
          isConnected: true,
          address: '0xabc123def456',
          provider: {} as never,
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
          address: '0xabc123def456',
          provider: {} as never,
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
          address: '0xabc123def456',
          provider: {} as never,
          signer: {} as never,
        }}
      >
        <Story />
      </WalletContext.Provider>
    ),
  ],
  parameters: { pseudo: { focus: 'button' } },
}

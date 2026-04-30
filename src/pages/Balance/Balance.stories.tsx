import type { Meta, StoryObj } from '@storybook/react-vite'
import { userEvent, within } from 'storybook/test'
import { WalletContext, type WalletContextValue } from '../../context/useWallet'
import { Balance, BalanceResultView } from './Balance'
import en from '../../locales/en.json'

const VALID_ADDRESS = '0x1234567890abcdef1234567890abcdef12345678'

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
  decorators: [
    (Story, { args }) => (
      <WalletContext.Provider value={args}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
} satisfies Meta<WalletContextValue>

type Story = StoryObj<WalletContextValue>

export const Disconnected: Story = { args: base }

export const ConnectedEmpty: Story = {
  args: { ...base, isConnected: true, address: VALID_ADDRESS },
}

export const ButtonHover: Story = {
  args: base,
  parameters: { pseudo: { hover: 'button' } },
}

export const InvalidAddress: Story = {
  args: { ...base, isConnected: true, address: VALID_ADDRESS, provider: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.clear(canvas.getByPlaceholderText(en.balance.placeholder))
    await userEvent.type(canvas.getByPlaceholderText(en.balance.placeholder), 'notanaddress')
    await userEvent.click(canvas.getByText(en.balance.checkBtn))
  },
}

export const WithTicket: Story = {
  render: () => <BalanceResultView seth="1.5" etk={1n} remaining={999n} />,
}

export const NoTicket: Story = {
  render: () => <BalanceResultView seth="0.5" etk={0n} remaining={500n} />,
}

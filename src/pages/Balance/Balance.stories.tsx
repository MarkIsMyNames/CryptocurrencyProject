import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletContext } from '../../context/WalletContext'
import { Balance } from './Balance'

const walletCtx = {
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

const meta: Meta<typeof Balance> = {
  title: 'Pages/Balance',
  component: Balance,
  decorators: [
    (Story) => (
      <WalletContext.Provider value={walletCtx}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Balance>

export const Default: Story = {}

export const InputFocus: Story = {
  parameters: { pseudo: { focus: 'input' } },
}

export const ButtonHover: Story = {
  parameters: { pseudo: { hover: 'button' } },
}

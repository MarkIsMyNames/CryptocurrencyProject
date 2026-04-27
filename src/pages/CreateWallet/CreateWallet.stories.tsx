import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { WalletContext } from '../../context/WalletContext'
import { CreateWallet } from './CreateWallet'

const noop = () => undefined
const noopAsync = () => Promise.resolve()

const defaultWalletValue = {
  provider: null,
  signer: null,
  address: null,
  ethBalance: null,
  etkBalance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  connect: noopAsync,
  disconnect: noop,
  refreshBalances: noopAsync,
}

const meta: Meta<typeof CreateWallet> = {
  title: 'Pages/CreateWallet',
  component: CreateWallet,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <WalletContext.Provider value={defaultWalletValue}>
          <Story />
        </WalletContext.Provider>
      </MemoryRouter>
    ),
  ],
  parameters: {
    a11y: { disable: false },
  },
}

export default meta
type Story = StoryObj<typeof CreateWallet>

export const Default: Story = {}

export const Connecting: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider value={{ ...defaultWalletValue, isConnecting: true }}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
}

export const ButtonFocus: Story = {
  parameters: {
    pseudo: { focus: true },
  },
}

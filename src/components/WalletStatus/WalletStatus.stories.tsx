import type { Meta, StoryObj } from '@storybook/react-vite'
import { WalletStatus } from './WalletStatus'
import { WalletContext } from '../../context/WalletContext'

const disconnectedState = {
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

const connectedState = {
  ...disconnectedState,
  isConnected: true,
  address: '0x1234567890abcdef1234567890abcdef12345678',
  ethBalance: BigInt('1000000000000000000'),
  etkBalance: BigInt(1),
}

const meta: Meta<typeof WalletStatus> = {
  title: 'Components/WalletStatus',
  component: WalletStatus,
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof WalletStatus>

export const Disconnected: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider value={disconnectedState}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
}

export const Connected: Story = {
  decorators: [
    (Story) => (
      <WalletContext.Provider value={connectedState}>
        <Story />
      </WalletContext.Provider>
    ),
  ],
}

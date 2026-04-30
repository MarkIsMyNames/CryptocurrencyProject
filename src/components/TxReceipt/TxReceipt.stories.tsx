import type { Meta, StoryObj } from '@storybook/react-vite'
import { TxReceipt } from './TxReceipt'

const HASH = '0xabc1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcd'

export default {
  component: TxReceipt,
} satisfies Meta<typeof TxReceipt>

type Story = StoryObj<typeof TxReceipt>

export const Default: Story = {
  args: { hash: HASH },
}

export const LinkHover: Story = {
  args: { hash: HASH },
  parameters: { pseudo: { hover: true } },
}

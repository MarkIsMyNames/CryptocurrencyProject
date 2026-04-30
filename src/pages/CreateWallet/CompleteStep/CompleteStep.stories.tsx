import type { Meta, StoryObj } from '@storybook/react-vite'
import { CompleteStep } from './CompleteStep'

const FAKE_ADDRESS = '0xAbCd1234567890abcdef1234567890abcdef1234'
const noop = () => {}

export default { component: CompleteStep } satisfies Meta<typeof CompleteStep>

type Story = StoryObj<typeof CompleteStep>

export const Default: Story = {
  args: { address: FAKE_ADDRESS, onDownload: noop, onGoToBalance: noop },
}

export const ButtonHover: Story = {
  args: { address: FAKE_ADDRESS, onDownload: noop, onGoToBalance: noop },
  parameters: { pseudo: { hover: 'button' } },
}

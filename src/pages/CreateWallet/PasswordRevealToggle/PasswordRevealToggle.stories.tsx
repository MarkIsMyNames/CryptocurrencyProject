import type { Meta, StoryObj } from '@storybook/react-vite'
import { PasswordRevealToggle } from './PasswordRevealToggle'

const noop = () => {}

export default { component: PasswordRevealToggle } satisfies Meta<typeof PasswordRevealToggle>

type Story = StoryObj<typeof PasswordRevealToggle>

export const Hidden: Story = { args: { show: false, onToggle: noop } }

export const Visible: Story = { args: { show: true, onToggle: noop } }

export const Hover: Story = {
  args: { show: false, onToggle: noop },
  parameters: { pseudo: { hover: true } },
}

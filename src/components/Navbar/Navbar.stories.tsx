import type { Meta, StoryObj } from '@storybook/react-vite'
import { Navbar } from './Navbar'

export default { component: Navbar } satisfies Meta<typeof Navbar>

type Story = StoryObj<typeof Navbar>

export const Default: Story = {}

export const HoverState: Story = {
  parameters: { pseudo: { hover: true } },
}

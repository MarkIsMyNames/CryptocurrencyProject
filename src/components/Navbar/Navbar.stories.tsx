import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import { Navbar } from './Navbar'

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  decorators: [(Story) => <MemoryRouter><Story /></MemoryRouter>],
  parameters: { a11y: { disable: false } },
}
export default meta

type Story = StoryObj<typeof Navbar>

export const Default: Story = {}

export const HoverState: Story = {
  parameters: { pseudo: { hover: true } },
}

export const FocusState: Story = {
  parameters: { pseudo: { focus: true } },
}

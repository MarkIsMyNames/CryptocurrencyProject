import type { Meta, StoryObj } from '@storybook/react-vite'
import { theme } from '../../theme'
import { Navbar } from './Navbar'

const withHeader = (Story: () => React.ReactNode) => (
  <header
    style={{
      background: theme.colors.backgroundCard,
      borderBottom: `1px solid ${theme.colors.borderDefault}`,
      display: 'flex',
    }}
  >
    <Story />
  </header>
)

export default {
  component: Navbar,
  decorators: [withHeader],
} satisfies Meta<typeof Navbar>

type Story = StoryObj<typeof Navbar>

export const Default: Story = {}

export const HoverState: Story = {
  parameters: { pseudo: { hover: true } },
}

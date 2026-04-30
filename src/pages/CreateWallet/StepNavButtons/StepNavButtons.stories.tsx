import type { Meta, StoryObj } from '@storybook/react-vite'
import en from '../../../locales/en.json'
import { StepNavButtons } from './StepNavButtons'

const noop = () => {}

export default { component: StepNavButtons } satisfies Meta<typeof StepNavButtons>

type Story = StoryObj<typeof StepNavButtons>

export const Default: Story = { args: { onBack: noop, onNext: noop } }

export const Disabled: Story = {
  args: { onBack: noop, onNext: noop, disabled: true },
}

export const CustomLabel: Story = {
  args: { onBack: noop, onNext: noop, primaryLabel: en.createWallet.verifyBtn },
}

export const Loading: Story = {
  args: { onBack: noop, onNext: noop, primaryLabel: en.createWallet.connecting, disabled: true },
}

export const ButtonHover: Story = {
  args: { onBack: noop, onNext: noop },
  parameters: { pseudo: { hover: 'button' } },
}

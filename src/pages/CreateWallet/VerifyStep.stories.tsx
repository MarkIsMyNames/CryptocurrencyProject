import type { Meta, StoryObj } from '@storybook/react-vite'
import en from '../../locales/en.json'
import { VerifyStep } from './VerifyStep'

const noop = () => {}

const base = {
  verifyIndices: [0, 4, 8],
  verifyAnswers: ['', '', ''],
  verifyError: null,
  connectError: null,
  isConnecting: false,
  onAnswerChange: noop,
  onBack: noop,
  onVerify: noop,
}

export default { component: VerifyStep } satisfies Meta<typeof VerifyStep>

type Story = StoryObj<typeof VerifyStep>

export const Default: Story = { args: base }

export const WithAnswers: Story = {
  args: { ...base, verifyAnswers: ['abandon', 'above', 'absurd'] },
}

export const WrongWords: Story = {
  args: { ...base, verifyError: en.createWallet.wrongWords },
}

export const Connecting: Story = {
  args: { ...base, isConnecting: true },
}

export const ButtonHover: Story = {
  args: base,
  parameters: { pseudo: { hover: 'button' } },
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import en from '../../locales/en.json'
import { PasswordStep } from './PasswordStep'

const noop = () => {}

const base = {
  password: '',
  confirm: '',
  showPassword: false,
  passwordError: null,
  onPasswordChange: noop,
  onConfirmChange: noop,
  onToggleShow: noop,
  onBack: noop,
  onNext: noop,
}

export default { component: PasswordStep } satisfies Meta<typeof PasswordStep>

type Story = StoryObj<typeof PasswordStep>

export const Default: Story = { args: base }

export const WithValues: Story = {
  args: { ...base, password: 'mysecret1', confirm: 'mysecret1' },
}

export const PasswordVisible: Story = {
  args: { ...base, password: 'mysecret1', confirm: 'mysecret1', showPassword: true },
}

export const ErrorMismatch: Story = {
  args: { ...base, passwordError: en.createWallet.passwordMismatch },
}

export const ErrorTooShort: Story = {
  args: { ...base, passwordError: en.createWallet.passwordMinLength },
}

export const ButtonHover: Story = {
  args: base,
  parameters: { pseudo: { hover: 'button' } },
}

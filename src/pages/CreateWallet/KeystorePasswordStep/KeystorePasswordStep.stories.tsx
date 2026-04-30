import type { Meta, StoryObj } from '@storybook/react-vite'
import en from '../../../locales/en.json'
import { KeystorePasswordStep } from './KeystorePasswordStep'

const noop = () => {}
const noopStr = noop as (v: string) => void

const base = {
  password: '',
  passwordError: null,
  isDecrypting: false,
  onPasswordChange: noopStr,
  onBack: noop,
  onDecrypt: noop,
}

export default { component: KeystorePasswordStep } satisfies Meta<typeof KeystorePasswordStep>

type Story = StoryObj<typeof KeystorePasswordStep>

export const Default: Story = { args: base }

export const WithError: Story = {
  args: { ...base, passwordError: en.createWallet.keystorePasswordError },
}

export const Decrypting: Story = {
  args: { ...base, password: 'mysecret', isDecrypting: true },
}

export const ButtonHover: Story = {
  args: base,
  parameters: { pseudo: { hover: 'button' } },
}

export const PasswordVisible: Story = {
  args: { ...base, password: 'mysecret' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: en.createWallet.showPassword }))
  },
}

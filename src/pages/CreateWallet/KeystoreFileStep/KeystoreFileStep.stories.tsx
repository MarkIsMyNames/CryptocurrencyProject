import type { Meta, StoryObj } from '@storybook/react-vite'
import en from '../../../locales/en.json'
import { KeystoreFileStep } from './KeystoreFileStep'

const noop = () => {}
const noopFile = noop as (file: File) => void

export default { component: KeystoreFileStep } satisfies Meta<typeof KeystoreFileStep>

type Story = StoryObj<typeof KeystoreFileStep>

export const Default: Story = { args: { fileError: null, onFileSelect: noopFile, onBack: noop } }

export const WithError: Story = {
  args: { fileError: en.createWallet.keystoreFileError, onFileSelect: noopFile, onBack: noop },
}

export const BackHover: Story = {
  args: { fileError: null, onFileSelect: noopFile, onBack: noop },
  parameters: { pseudo: { hover: 'button' } },
}

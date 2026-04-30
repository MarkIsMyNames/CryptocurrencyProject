import type { Meta, StoryObj } from '@storybook/react-vite'
import { PhraseStep } from './PhraseStep'

const FAKE_MNEMONIC =
  'abandon ability able about above absent absorb abstract absurd abuse access accident'
const noop = () => {}

const base = {
  mnemonic: FAKE_MNEMONIC,
  acknowledged: false,
  onAcknowledge: noop,
  onBack: noop,
  onNext: noop,
}

export default { component: PhraseStep } satisfies Meta<typeof PhraseStep>

type Story = StoryObj<typeof PhraseStep>

export const Default: Story = { args: base }

export const Acknowledged: Story = {
  args: { ...base, acknowledged: true },
}

export const ButtonHover: Story = {
  args: base,
  parameters: { pseudo: { hover: 'button' } },
}

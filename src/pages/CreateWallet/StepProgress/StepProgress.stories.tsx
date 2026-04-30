import type { Meta, StoryObj } from '@storybook/react-vite'
import { StepProgress } from './StepProgress'

export default { component: StepProgress } satisfies Meta<typeof StepProgress>

type Story = StoryObj<typeof StepProgress>

export const Step1: Story = { args: { stepIndex: 0 } }
export const Step2: Story = { args: { stepIndex: 1 } }
export const Step3: Story = { args: { stepIndex: 2 } }

import { customRender, screen } from '../../../test-utils'
import { describe, it, expect } from 'vitest'
import { config } from '../../../config'
import { StepProgress } from './StepProgress'

function renderProgress(stepIndex: number) {
  return customRender(<StepProgress stepIndex={stepIndex} />)
}

describe('StepProgress', () => {
  it('renders the correct number of dots', () => {
    renderProgress(0)
    expect(screen.getAllByTestId('step-dot')).toHaveLength(config.createWalletStepCount)
  })

  it('marks only the current step as active', () => {
    renderProgress(1)
    const dots = screen.getAllByTestId('step-dot')
    expect(dots[0]).toHaveAttribute('data-active', 'false')
    expect(dots[1]).toHaveAttribute('data-active', 'true')
    expect(dots[2]).toHaveAttribute('data-active', 'false')
  })

  it('marks steps before the current as done', () => {
    renderProgress(2)
    const dots = screen.getAllByTestId('step-dot')
    expect(dots[0]).toHaveAttribute('data-done', 'true')
    expect(dots[1]).toHaveAttribute('data-done', 'true')
    expect(dots[2]).toHaveAttribute('data-done', 'false')
  })

  it('marks no steps as done on the first step', () => {
    renderProgress(0)
    screen.getAllByTestId('step-dot').forEach((dot) => {
      expect(dot).toHaveAttribute('data-done', 'false')
    })
  })
})

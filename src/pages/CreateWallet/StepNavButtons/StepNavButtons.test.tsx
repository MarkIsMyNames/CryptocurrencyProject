import { customRender, screen, fireEvent } from '../../../test-utils'
import { describe, it, expect, vi } from 'vitest'
import en from '../../../locales/en.json'
import { StepNavButtons } from './StepNavButtons'

describe('StepNavButtons', () => {
  it('renders back and next buttons', () => {
    customRender(<StepNavButtons onBack={vi.fn()} onNext={vi.fn()} />)
    expect(screen.getByText(en.createWallet.backBtn)).toBeInTheDocument()
    expect(screen.getByText(en.createWallet.nextBtn)).toBeInTheDocument()
  })

  it('calls onBack when back button is clicked', () => {
    const onBack = vi.fn()
    customRender(<StepNavButtons onBack={onBack} onNext={vi.fn()} />)
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('calls onNext when primary button is clicked', () => {
    const onNext = vi.fn()
    customRender(<StepNavButtons onBack={vi.fn()} onNext={onNext} />)
    fireEvent.click(screen.getByText(en.createWallet.nextBtn))
    expect(onNext).toHaveBeenCalledOnce()
  })

  it('renders a custom primary label', () => {
    customRender(
      <StepNavButtons onBack={vi.fn()} onNext={vi.fn()} primaryLabel={en.createWallet.verifyBtn} />,
    )
    expect(screen.getByText(en.createWallet.verifyBtn)).toBeInTheDocument()
  })

  it('disables the primary button when disabled is true', () => {
    customRender(<StepNavButtons onBack={vi.fn()} onNext={vi.fn()} disabled />)
    expect(screen.getByText(en.createWallet.nextBtn)).toBeDisabled()
  })
})

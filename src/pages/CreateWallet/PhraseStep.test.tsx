import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { PhraseStep } from './PhraseStep'

const MNEMONIC =
  'abandon ability able about above absent absorb abstract absurd abuse access accident'
const noop = () => {}

function renderStep(overrides: Partial<Parameters<typeof PhraseStep>[0]> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <PhraseStep
        mnemonic={MNEMONIC}
        acknowledged={false}
        onAcknowledge={noop}
        onBack={noop}
        onNext={noop}
        {...overrides}
      />
    </ThemeProvider>,
  )
}

describe('PhraseStep', () => {
  it('renders all 12 mnemonic words', () => {
    renderStep()
    for (const word of MNEMONIC.split(' ')) {
      expect(screen.getByText(word)).toBeInTheDocument()
    }
  })

  it('Next button is disabled when not acknowledged', () => {
    renderStep({ acknowledged: false })
    expect(screen.getByText(en.createWallet.nextBtn)).toBeDisabled()
  })

  it('Next button is enabled when acknowledged', () => {
    renderStep({ acknowledged: true })
    expect(screen.getByText(en.createWallet.nextBtn)).not.toBeDisabled()
  })

  it('calls onAcknowledge when checkbox is toggled', () => {
    const onAcknowledge = vi.fn()
    renderStep({ onAcknowledge })
    fireEvent.click(screen.getByRole('checkbox'))
    expect(onAcknowledge).toHaveBeenCalledWith(true)
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    renderStep({ onBack })
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalled()
  })

  it('calls onNext when Next is clicked and acknowledged', () => {
    const onNext = vi.fn()
    renderStep({ acknowledged: true, onNext })
    fireEvent.click(screen.getByText(en.createWallet.nextBtn))
    expect(onNext).toHaveBeenCalled()
  })
})

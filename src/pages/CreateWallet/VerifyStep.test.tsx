import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { VerifyStep } from './VerifyStep'

const noop = () => {}
const INDICES = [0, 4, 8]
const ANSWERS = ['', '', '']

function renderStep(overrides: Partial<Parameters<typeof VerifyStep>[0]> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <VerifyStep
        verifyIndices={INDICES}
        verifyAnswers={ANSWERS}
        verifyError={null}
        connectError={null}
        isConnecting={false}
        onAnswerChange={noop}
        onBack={noop}
        onVerify={noop}
        {...overrides}
      />
    </ThemeProvider>,
  )
}

describe('VerifyStep', () => {
  it('renders one input per verify index', () => {
    renderStep()
    expect(screen.getAllByPlaceholderText(en.createWallet.wordPlaceholder)).toHaveLength(3)
  })

  it('renders word position labels from indices', () => {
    renderStep()
    expect(screen.getByText('Word #1')).toBeInTheDocument()
    expect(screen.getByText('Word #5')).toBeInTheDocument()
    expect(screen.getByText('Word #9')).toBeInTheDocument()
  })

  it('shows verify error when provided', () => {
    renderStep({ verifyError: en.createWallet.wrongWords })
    expect(screen.getByText(en.createWallet.wrongWords)).toBeInTheDocument()
  })

  it('shows connect error when provided', () => {
    renderStep({ connectError: 'Connection failed' })
    expect(screen.getByText('Connection failed')).toBeInTheDocument()
  })

  it('disables Verify button while connecting', () => {
    renderStep({ isConnecting: true })
    expect(screen.getByText(en.createWallet.connecting)).toBeDisabled()
  })

  it('calls onAnswerChange when an input changes', () => {
    const onAnswerChange = vi.fn()
    renderStep({ onAnswerChange })
    const inputs = screen.getAllByPlaceholderText(en.createWallet.wordPlaceholder)
    fireEvent.change(inputs[0], { target: { value: 'abandon' } })
    expect(onAnswerChange).toHaveBeenCalledWith(0, 'abandon')
  })

  it('calls onVerify when Verify button is clicked', () => {
    const onVerify = vi.fn()
    renderStep({ onVerify })
    fireEvent.click(screen.getByText(en.createWallet.verifyBtn))
    expect(onVerify).toHaveBeenCalled()
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    renderStep({ onBack })
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalled()
  })
})

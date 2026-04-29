import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider } from 'styled-components'
import { describe, it, expect, vi } from 'vitest'
import { theme } from '../../theme'
import en from '../../locales/en.json'
import { PasswordStep } from './PasswordStep'

const noop = () => {}

function renderStep(overrides: Partial<Parameters<typeof PasswordStep>[0]> = {}) {
  return render(
    <ThemeProvider theme={theme}>
      <PasswordStep
        password=""
        confirm=""
        showPassword={false}
        passwordError={null}
        onPasswordChange={noop}
        onConfirmChange={noop}
        onToggleShow={noop}
        onBack={noop}
        onNext={noop}
        {...overrides}
      />
    </ThemeProvider>,
  )
}

describe('PasswordStep', () => {
  it('renders password and confirm fields', () => {
    renderStep()
    expect(screen.getByLabelText(en.createWallet.passwordLabel)).toBeInTheDocument()
    expect(screen.getByLabelText(en.createWallet.confirmLabel)).toBeInTheDocument()
  })

  it('renders Back and Next buttons', () => {
    renderStep()
    expect(screen.getByText(en.createWallet.backBtn)).toBeInTheDocument()
    expect(screen.getByText(en.createWallet.nextBtn)).toBeInTheDocument()
  })

  it('shows password error when provided', () => {
    renderStep({ passwordError: en.createWallet.passwordMismatch })
    expect(screen.getByText(en.createWallet.passwordMismatch)).toBeInTheDocument()
  })

  it('calls onPasswordChange when password field changes', () => {
    const onPasswordChange = vi.fn()
    renderStep({ onPasswordChange })
    fireEvent.change(screen.getByLabelText(en.createWallet.passwordLabel), {
      target: { value: 'newpassword' },
    })
    expect(onPasswordChange).toHaveBeenCalledWith('newpassword')
  })

  it('calls onNext when Next is clicked', () => {
    const onNext = vi.fn()
    renderStep({ onNext })
    fireEvent.click(screen.getByText(en.createWallet.nextBtn))
    expect(onNext).toHaveBeenCalled()
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    renderStep({ onBack })
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalled()
  })

  it('calls onToggleShow when toggle button is clicked', () => {
    const onToggleShow = vi.fn()
    renderStep({ onToggleShow })
    fireEvent.click(screen.getByRole('button', { name: en.createWallet.showPassword }))
    expect(onToggleShow).toHaveBeenCalled()
  })

  it('shows text inputs when showPassword is true', () => {
    renderStep({ showPassword: true })
    const inputs = screen.getAllByDisplayValue('')
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('type', 'text')
    })
  })
})

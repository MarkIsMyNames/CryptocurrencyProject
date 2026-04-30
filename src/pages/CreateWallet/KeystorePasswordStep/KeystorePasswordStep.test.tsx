import { customRender, screen, fireEvent } from '../../../test-utils'
import { describe, it, expect, vi } from 'vitest'
import en from '../../../locales/en.json'
import { KeystorePasswordStep } from './KeystorePasswordStep'

describe('KeystorePasswordStep', () => {
  it('renders the instruction text', () => {
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    expect(screen.getByText(en.createWallet.keystorePasswordInstruction)).toBeInTheDocument()
  })

  it('renders a password input', () => {
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    expect(screen.getByLabelText(en.createWallet.keystorePasswordLabel)).toBeInTheDocument()
  })

  it('calls onPasswordChange on input', () => {
    const onPasswordChange = vi.fn()
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={onPasswordChange}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    fireEvent.change(screen.getByLabelText(en.createWallet.keystorePasswordLabel), {
      target: { value: 'secret' },
    })
    expect(onPasswordChange).toHaveBeenCalledWith('secret')
  })

  it('shows passwordError when provided', () => {
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={en.createWallet.keystorePasswordError}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    expect(screen.getByText(en.createWallet.keystorePasswordError)).toBeInTheDocument()
  })

  it('disables the decrypt button while decrypting', () => {
    customRender(
      <KeystorePasswordStep
        password="abc"
        passwordError={null}
        isDecrypting={true}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    expect(screen.getByText(en.createWallet.connecting)).toBeDisabled()
  })

  it('calls onBack when the back button is clicked', () => {
    const onBack = vi.fn()
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={onBack}
        onDecrypt={vi.fn()}
      />,
    )
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('toggles input type when the show/hide button is clicked', () => {
    customRender(
      <KeystorePasswordStep
        password=""
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={vi.fn()}
      />,
    )
    const input = screen.getByLabelText(en.createWallet.keystorePasswordLabel)
    expect(input).toHaveAttribute('type', 'password')
    fireEvent.click(screen.getByRole('button', { name: en.createWallet.showPassword }))
    expect(input).toHaveAttribute('type', 'text')
    fireEvent.click(screen.getByRole('button', { name: en.createWallet.hidePassword }))
    expect(input).toHaveAttribute('type', 'password')
  })

  it('calls onDecrypt when the decrypt button is clicked', () => {
    const onDecrypt = vi.fn()
    customRender(
      <KeystorePasswordStep
        password="abc"
        passwordError={null}
        isDecrypting={false}
        onPasswordChange={vi.fn()}
        onBack={vi.fn()}
        onDecrypt={onDecrypt}
      />,
    )
    fireEvent.click(screen.getByText(en.createWallet.keystoreDecryptBtn))
    expect(onDecrypt).toHaveBeenCalledOnce()
  })
})

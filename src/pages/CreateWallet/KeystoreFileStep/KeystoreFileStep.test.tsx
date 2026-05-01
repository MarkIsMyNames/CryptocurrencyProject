import { customRender, screen, fireEvent } from '../../../test-utils'
import { describe, it, expect, vi } from 'vitest'
import en from '../../../locales/en.json'
import { KeystoreFileStep } from './KeystoreFileStep'

describe('KeystoreFileStep', () => {
  it('renders the instruction text', () => {
    customRender(<KeystoreFileStep fileError={null} onFileSelect={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText(en.createWallet.keystoreFileInstruction)).toBeInTheDocument()
  })

  it('renders a file input', () => {
    customRender(<KeystoreFileStep fileError={null} onFileSelect={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByLabelText(en.createWallet.keystoreFileLabel)).toBeInTheDocument()
  })

  it('calls onFileSelect when a file is chosen', () => {
    const onFileSelect = vi.fn()
    customRender(<KeystoreFileStep fileError={null} onFileSelect={onFileSelect} onBack={vi.fn()} />)
    const file = new File(['{}'], 'keystore.json', { type: 'application/json' })
    fireEvent.change(screen.getByLabelText(en.createWallet.keystoreFileLabel), {
      target: { files: [file] },
    })
    expect(onFileSelect).toHaveBeenCalledWith(file)
  })

  it('renders a Back button', () => {
    customRender(<KeystoreFileStep fileError={null} onFileSelect={vi.fn()} onBack={vi.fn()} />)
    expect(screen.getByText(en.createWallet.backBtn)).toBeInTheDocument()
  })

  it('calls onBack when Back is clicked', () => {
    const onBack = vi.fn()
    customRender(<KeystoreFileStep fileError={null} onFileSelect={vi.fn()} onBack={onBack} />)
    fireEvent.click(screen.getByText(en.createWallet.backBtn))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('shows fileError when provided', () => {
    customRender(
      <KeystoreFileStep
        fileError={en.createWallet.keystoreFileError}
        onFileSelect={vi.fn()}
        onBack={vi.fn()}
      />,
    )
    expect(screen.getByText(en.createWallet.keystoreFileError)).toBeInTheDocument()
  })
})

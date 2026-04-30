import { customRender, screen, fireEvent } from '../../../test-utils'
import { describe, it, expect, vi } from 'vitest'
import en from '../../../locales/en.json'
import { CompleteStep } from './CompleteStep'

const FAKE_ADDRESS = '0xAbCd1234567890abcdef1234567890abcdef1234'
const noop = () => {}

function renderStep(overrides: Partial<Parameters<typeof CompleteStep>[0]> = {}) {
  return customRender(
    <CompleteStep address={FAKE_ADDRESS} onDownload={noop} onGoToBalance={noop} {...overrides} />,
  )
}

describe('CompleteStep', () => {
  it('renders success message', () => {
    renderStep()
    expect(screen.getByText(en.createWallet.walletCreated)).toBeInTheDocument()
  })

  it('renders the wallet address', () => {
    renderStep()
    expect(screen.getByText(FAKE_ADDRESS)).toBeInTheDocument()
  })

  it('renders Download and Go to Balance buttons', () => {
    renderStep()
    expect(screen.getByText(en.createWallet.downloadBtn)).toBeInTheDocument()
    expect(screen.getByText(en.createWallet.goToBalance)).toBeInTheDocument()
  })

  it('calls onDownload when Download is clicked', () => {
    const onDownload = vi.fn()
    renderStep({ onDownload })
    fireEvent.click(screen.getByText(en.createWallet.downloadBtn))
    expect(onDownload).toHaveBeenCalled()
  })

  it('calls onGoToBalance when Go to Balance is clicked', () => {
    const onGoToBalance = vi.fn()
    renderStep({ onGoToBalance })
    fireEvent.click(screen.getByText(en.createWallet.goToBalance))
    expect(onGoToBalance).toHaveBeenCalled()
  })
})

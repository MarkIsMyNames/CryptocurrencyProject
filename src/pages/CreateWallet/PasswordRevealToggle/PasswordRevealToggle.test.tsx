import { customRender, screen, fireEvent } from '../../../test-utils'
import { describe, it, expect, vi } from 'vitest'
import en from '../../../locales/en.json'
import { PasswordRevealToggle } from './PasswordRevealToggle'

describe('PasswordRevealToggle', () => {
  it('renders show-password label when hidden', () => {
    customRender(<PasswordRevealToggle show={false} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: en.createWallet.showPassword })).toBeInTheDocument()
  })

  it('renders hide-password label when visible', () => {
    customRender(<PasswordRevealToggle show={true} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: en.createWallet.hidePassword })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn()
    customRender(<PasswordRevealToggle show={false} onToggle={onToggle} />)
    fireEvent.click(screen.getByRole('button', { name: en.createWallet.showPassword }))
    expect(onToggle).toHaveBeenCalledOnce()
  })
})

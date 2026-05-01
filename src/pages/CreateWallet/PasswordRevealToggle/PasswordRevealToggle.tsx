import en from '../../../locales/en.json'
import { PasswordToggle } from '../CreateWallet.styles'

interface PasswordRevealToggleProps {
  show: boolean
  onToggle: () => void
}

export function PasswordRevealToggle({ show, onToggle }: PasswordRevealToggleProps) {
  return (
    <PasswordToggle
      type="button"
      aria-label={show ? en.createWallet.hidePassword : en.createWallet.showPassword}
      onClick={onToggle}
    >
      {show ? '🙈' : '👁'}
    </PasswordToggle>
  )
}

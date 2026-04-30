import en from '../../../locales/en.json'
import { ButtonRow, PrimaryButton, SecondaryButton } from '../CreateWallet.styles'

interface StepNavButtonsProps {
  onBack: () => void
  onNext: () => void
  primaryLabel?: string
  disabled?: boolean
}

export function StepNavButtons({ onBack, onNext, primaryLabel, disabled }: StepNavButtonsProps) {
  return (
    <ButtonRow>
      <SecondaryButton onClick={onBack}>{en.createWallet.backBtn}</SecondaryButton>
      <PrimaryButton disabled={disabled} onClick={onNext}>
        {primaryLabel ?? en.createWallet.nextBtn}
      </PrimaryButton>
    </ButtonRow>
  )
}

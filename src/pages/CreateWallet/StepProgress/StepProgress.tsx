import { config } from '../../../config'
import { ProgressDots, Dot } from '../CreateWallet.styles'

export function StepProgress({ stepIndex }: { stepIndex: number }) {
  return (
    <ProgressDots>
      {Array.from({ length: config.createWalletStepCount }, (_, i) => (
        <Dot
          key={i}
          $active={i === stepIndex}
          $done={i < stepIndex}
          data-testid="step-dot"
          data-active={i === stepIndex}
          data-done={i < stepIndex}
        />
      ))}
    </ProgressDots>
  )
}

import en from '../../../locales/en.json'
import { StepProgress } from '../StepProgress/StepProgress'
import { StepNavButtons } from '../StepNavButtons/StepNavButtons'
import {
  PageWrapper,
  Title,
  StepLabel,
  WarningBox,
  PhraseGrid,
  PhraseWord,
  WordIndex,
  WordText,
  CheckboxRow,
} from '../CreateWallet.styles'

interface PhraseStepProps {
  mnemonic: string
  acknowledged: boolean
  onAcknowledge: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}

export function PhraseStep({ mnemonic, acknowledged, onAcknowledge, onBack, onNext }: PhraseStepProps) {
  const words = mnemonic.split(' ')
  return (
    <PageWrapper>
      <StepLabel>{en.createWallet.steps.phrase}</StepLabel>
      <StepProgress stepIndex={1} />
      <Title>{en.createWallet.steps.phrase}</Title>
      <WarningBox>{en.createWallet.phraseInstruction}</WarningBox>
      <PhraseGrid>
        {words.map((word, i) => (
          <PhraseWord key={i}>
            <WordIndex>{i + 1}.</WordIndex>
            <WordText>{word}</WordText>
          </PhraseWord>
        ))}
      </PhraseGrid>
      <CheckboxRow>
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => {
            onAcknowledge(e.target.checked)
          }}
        />
        {en.createWallet.phraseAcknowledge}
      </CheckboxRow>
      <StepNavButtons onBack={onBack} onNext={onNext} disabled={!acknowledged} />
    </PageWrapper>
  )
}

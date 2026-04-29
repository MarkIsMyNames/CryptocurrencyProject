import en from '../../locales/en.json'
import {
  PageWrapper,
  Title,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  StepLabel,
  ProgressDots,
  Dot,
  WarningBox,
  PhraseGrid,
  PhraseWord,
  WordIndex,
  WordText,
  CheckboxRow,
} from './CreateWallet.styles'

const STEP_COUNT = 3

export function PhraseStep({
  mnemonic,
  acknowledged,
  onAcknowledge,
  onBack,
  onNext,
}: {
  mnemonic: string
  acknowledged: boolean
  onAcknowledge: (v: boolean) => void
  onBack: () => void
  onNext: () => void
}) {
  const words = mnemonic.split(' ')
  return (
    <PageWrapper>
      <StepLabel>{en.createWallet.steps.phrase}</StepLabel>
      <ProgressDots>
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <Dot key={i} $active={i === 1} $done={i < 1} />
        ))}
      </ProgressDots>
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
      <ButtonRow>
        <SecondaryButton onClick={onBack}>{en.createWallet.backBtn}</SecondaryButton>
        <PrimaryButton disabled={!acknowledged} onClick={onNext}>
          {en.createWallet.nextBtn}
        </PrimaryButton>
      </ButtonRow>
    </PageWrapper>
  )
}

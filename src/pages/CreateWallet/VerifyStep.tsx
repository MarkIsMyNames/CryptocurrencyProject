import { Status } from '../../config'
import en from '../../locales/en.json'
import { StatusMessage } from '../../styles/shared.styles'
import {
  PageWrapper,
  Title,
  Subtitle,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  StepLabel,
  ProgressDots,
  Dot,
  InputGroup,
  Label,
  TextInput,
  ErrorText,
  VerifyGrid,
} from './CreateWallet.styles'

const STEP_COUNT = 3

export function VerifyStep({
  verifyIndices,
  verifyAnswers,
  verifyError,
  connectError,
  isConnecting,
  onAnswerChange,
  onBack,
  onVerify,
}: {
  verifyIndices: number[]
  verifyAnswers: string[]
  verifyError: string | null
  connectError: string | null
  isConnecting: boolean
  onAnswerChange: (i: number, v: string) => void
  onBack: () => void
  onVerify: () => void
}) {
  return (
    <PageWrapper>
      <StepLabel>{en.createWallet.steps.verify}</StepLabel>
      <ProgressDots>
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <Dot key={i} $active={i === 2} $done={i < 2} />
        ))}
      </ProgressDots>
      <Title>{en.createWallet.steps.verify}</Title>
      <Subtitle>{en.createWallet.verifyInstruction}</Subtitle>
      <VerifyGrid>
        {verifyIndices.map((wordIdx, i) => (
          <InputGroup key={wordIdx}>
            <Label htmlFor={`verify-${String(i)}`}>
              {en.createWallet.wordPosition.replace('{{n}}', String(wordIdx + 1))}
            </Label>
            <TextInput
              id={`verify-${String(i)}`}
              type="text"
              placeholder={en.createWallet.wordPlaceholder}
              value={verifyAnswers[i]}
              onChange={(e) => {
                onAnswerChange(i, e.target.value)
              }}
            />
          </InputGroup>
        ))}
      </VerifyGrid>
      {verifyError !== null && <ErrorText>{verifyError}</ErrorText>}
      {connectError !== null && <StatusMessage $type={Status.error}>{connectError}</StatusMessage>}
      <ButtonRow>
        <SecondaryButton onClick={onBack}>{en.createWallet.backBtn}</SecondaryButton>
        <PrimaryButton disabled={isConnecting} onClick={onVerify}>
          {isConnecting ? en.createWallet.connecting : en.createWallet.verifyBtn}
        </PrimaryButton>
      </ButtonRow>
    </PageWrapper>
  )
}

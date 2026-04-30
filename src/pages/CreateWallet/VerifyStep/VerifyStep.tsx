import { Status } from '../../../config'
import en from '../../../locales/en.json'
import { StepProgress } from '../StepProgress/StepProgress'
import { StepNavButtons } from '../StepNavButtons/StepNavButtons'
import { StatusMessage } from '../../../styles/shared.styles'
import {
  PageWrapper,
  Title,
  Subtitle,
  StepLabel,
  InputGroup,
  Label,
  TextInput,
  ErrorText,
  VerifyGrid,
} from '../CreateWallet.styles'

interface VerifyStepProps {
  verifyIndices: number[]
  verifyAnswers: string[]
  verifyError: string | null
  connectError: string | null
  isConnecting: boolean
  onAnswerChange: (i: number, v: string) => void
  onBack: () => void
  onVerify: () => void
}

export function VerifyStep({
  verifyIndices,
  verifyAnswers,
  verifyError,
  connectError,
  isConnecting,
  onAnswerChange,
  onBack,
  onVerify,
}: VerifyStepProps) {
  return (
    <PageWrapper>
      <StepLabel>{en.createWallet.steps.verify}</StepLabel>
      <StepProgress stepIndex={2} />
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
      <StepNavButtons
        onBack={onBack}
        onNext={onVerify}
        primaryLabel={isConnecting ? en.createWallet.connecting : en.createWallet.verifyBtn}
        disabled={isConnecting}
      />
    </PageWrapper>
  )
}

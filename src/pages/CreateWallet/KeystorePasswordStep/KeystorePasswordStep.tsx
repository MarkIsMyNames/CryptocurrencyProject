import en from '../../../locales/en.json'
import { StepNavButtons } from '../StepNavButtons/StepNavButtons'
import {
  PageWrapper,
  Subtitle,
  Form,
  InputGroup,
  Label,
  TextInput,
  ErrorText,
} from '../CreateWallet.styles'

interface KeystorePasswordStepProps {
  password: string
  passwordError: string | null
  isDecrypting: boolean
  onPasswordChange: (v: string) => void
  onBack: () => void
  onDecrypt: () => void
}

export function KeystorePasswordStep({
  password,
  passwordError,
  isDecrypting,
  onPasswordChange,
  onBack,
  onDecrypt,
}: KeystorePasswordStepProps) {
  return (
    <PageWrapper>
      <Subtitle>{en.createWallet.keystorePasswordInstruction}</Subtitle>
      <Form>
        <InputGroup>
          <Label htmlFor="keystore-pw">{en.createWallet.keystorePasswordLabel}</Label>
          <TextInput
            id="keystore-pw"
            type="password"
            placeholder={en.createWallet.keystorePasswordPlaceholder}
            value={password}
            onChange={(e) => {
              onPasswordChange(e.target.value)
            }}
          />
        </InputGroup>
        {passwordError !== null && <ErrorText>{passwordError}</ErrorText>}
      </Form>
      <StepNavButtons
        onBack={onBack}
        onNext={onDecrypt}
        primaryLabel={
          isDecrypting ? en.createWallet.connecting : en.createWallet.keystoreDecryptBtn
        }
        disabled={isDecrypting}
      />
    </PageWrapper>
  )
}

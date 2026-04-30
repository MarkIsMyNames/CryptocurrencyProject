import en from '../../../locales/en.json'
import { StepProgress } from '../StepProgress/StepProgress'
import { StepNavButtons } from '../StepNavButtons/StepNavButtons'
import {
  PageWrapper,
  Title,
  StepLabel,
  Form,
  InputGroup,
  Label,
  TextInput,
  PasswordWrapper,
  PasswordToggle,
  ErrorText,
} from '../CreateWallet.styles'

interface PasswordStepProps {
  password: string
  confirm: string
  showPassword: boolean
  passwordError: string | null
  onPasswordChange: (v: string) => void
  onConfirmChange: (v: string) => void
  onToggleShow: () => void
  onBack: () => void
  onNext: () => void
}

export function PasswordStep({
  password,
  confirm,
  showPassword,
  passwordError,
  onPasswordChange,
  onConfirmChange,
  onToggleShow,
  onBack,
  onNext,
}: PasswordStepProps) {
  const title = en.createWallet.steps.password
  return (
    <PageWrapper>
      <StepLabel>{title}</StepLabel>
      <StepProgress stepIndex={0} />
      <Title>{title}</Title>
      <Form>
        <InputGroup>
          <Label htmlFor="pw">{en.createWallet.passwordLabel}</Label>
          <PasswordWrapper>
            <TextInput
              id="pw"
              type={showPassword ? 'text' : 'password'}
              placeholder={en.createWallet.passwordPlaceholder}
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
            <PasswordToggle
              type="button"
              aria-label={
                showPassword ? en.createWallet.hidePassword : en.createWallet.showPassword
              }
              onClick={onToggleShow}
            >
              {showPassword ? '🙈' : '👁'}
            </PasswordToggle>
          </PasswordWrapper>
        </InputGroup>
        <InputGroup>
          <Label htmlFor="pw-confirm">{en.createWallet.confirmLabel}</Label>
          <PasswordWrapper>
            <TextInput
              id="pw-confirm"
              type={showPassword ? 'text' : 'password'}
              placeholder={en.createWallet.confirmPlaceholder}
              value={confirm}
              onChange={(e) => onConfirmChange(e.target.value)}
            />
          </PasswordWrapper>
        </InputGroup>
        {passwordError !== null && <ErrorText>{passwordError}</ErrorText>}
      </Form>
      <StepNavButtons onBack={onBack} onNext={onNext} />
    </PageWrapper>
  )
}

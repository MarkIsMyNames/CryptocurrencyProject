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
  Form,
  InputGroup,
  Label,
  TextInput,
  PasswordWrapper,
  PasswordToggle,
  ErrorText,
} from './CreateWallet.styles'

const STEP_COUNT = 3

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
}: {
  password: string
  confirm: string
  showPassword: boolean
  passwordError: string | null
  onPasswordChange: (v: string) => void
  onConfirmChange: (v: string) => void
  onToggleShow: () => void
  onBack: () => void
  onNext: () => void
}) {
  return (
    <PageWrapper>
      <StepLabel>{en.createWallet.steps.password}</StepLabel>
      <ProgressDots>
        {Array.from({ length: STEP_COUNT }, (_, i) => (
          <Dot key={i} $active={i === 0} $done={false} />
        ))}
      </ProgressDots>
      <Title>{en.createWallet.steps.password}</Title>
      <Form>
        <InputGroup>
          <Label htmlFor="pw">{en.createWallet.passwordLabel}</Label>
          <PasswordWrapper>
            <TextInput
              id="pw"
              type={showPassword ? 'text' : 'password'}
              placeholder={en.createWallet.passwordPlaceholder}
              value={password}
              onChange={(e) => {
                onPasswordChange(e.target.value)
              }}
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
              onChange={(e) => {
                onConfirmChange(e.target.value)
              }}
            />
          </PasswordWrapper>
        </InputGroup>
        {passwordError !== null && <ErrorText>{passwordError}</ErrorText>}
      </Form>
      <ButtonRow>
        <SecondaryButton onClick={onBack}>{en.createWallet.backBtn}</SecondaryButton>
        <PrimaryButton onClick={onNext}>{en.createWallet.nextBtn}</PrimaryButton>
      </ButtonRow>
    </PageWrapper>
  )
}

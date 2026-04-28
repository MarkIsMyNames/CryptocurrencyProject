import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../context/useWallet'
import { generateWallet, downloadKeystore } from '../../utils/wallet'
import type { GeneratedWallet } from '../../utils/wallet'
import { Status, routes } from '../../config'
import en from '../../locales/en.json'
import { StatusMessage } from '../../styles/shared.styles'
import {
  PageWrapper,
  Title,
  Subtitle,
  ButtonRow,
  PrimaryButton,
  SecondaryButton,
  Card,
  CardLabel,
  CardValue,
  StepLabel,
  ProgressDots,
  Dot,
  Form,
  InputGroup,
  Label,
  TextInput,
  ErrorText,
  PhraseGrid,
  PhraseWord,
  WordIndex,
  WordText,
  CheckboxRow,
  WarningBox,
  VerifyGrid,
} from './CreateWallet.styles'

type Step = 'idle' | 'password' | 'phrase' | 'verify' | 'complete'

const STEPS: Step[] = ['password', 'phrase', 'verify', 'complete']
const VERIFY_COUNT = 3

function pickVerifyIndices(mnemonic: string): number[] {
  const wordCount = mnemonic.split(' ').length
  const indices = new Set<number>()
  while (indices.size < VERIFY_COUNT) {
    indices.add(Math.floor(Math.random() * wordCount))
  }
  return [...indices].sort((a, b) => a - b)
}

export function CreateWallet() {
  const navigate = useNavigate()
  const { connect, connectWithWallet, isConnecting, isConnected, error } = useWallet()

  const [step, setStep] = useState<Step>('idle')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [verifyIndices, setVerifyIndices] = useState<number[]>([])
  const [verifyAnswers, setVerifyAnswers] = useState<string[]>(['', '', ''])
  const [verifyError, setVerifyError] = useState<string | null>(null)

  const stepIndex = STEPS.indexOf(step)

  function handleStartGenerate() {
    setPassword('')
    setConfirm('')
    setPasswordError(null)
    setStep('password')
  }

  function handlePasswordNext() {
    if (password.length < 8) {
      setPasswordError(en.createWallet.passwordMinLength)
      return
    }
    if (password !== confirm) {
      setPasswordError(en.createWallet.passwordMismatch)
      return
    }
    const generated = generateWallet()
    setWallet(generated)
    setAcknowledged(false)
    const indices = pickVerifyIndices(generated.mnemonic)
    setVerifyIndices(indices)
    setVerifyAnswers(['', '', ''])
    setVerifyError(null)
    setStep('phrase')
  }

  function handlePhraseNext() {
    setStep('verify')
  }

  async function handleVerify() {
    if (!wallet) return
    const words = wallet.mnemonic.split(' ')
    const correct = verifyIndices.every(
      (idx, i) => verifyAnswers[i].trim().toLowerCase() === words[idx].toLowerCase(),
    )
    if (!correct) {
      setVerifyError(en.createWallet.wrongWords)
      return
    }
    const success = await connectWithWallet(wallet.privateKey)
    if (success) setStep('complete')
  }

  async function handleDownload() {
    if (!wallet) return
    await downloadKeystore(wallet, password)
  }

  if (step === 'idle') {
    return (
      <PageWrapper>
        <Title>{en.createWallet.title}</Title>
        <Subtitle>{en.createWallet.subtitle}</Subtitle>
        <ButtonRow>
          <PrimaryButton onClick={handleStartGenerate}>{en.createWallet.generateBtn}</PrimaryButton>
          <PrimaryButton
            disabled={isConnecting || isConnected}
            onClick={() => {
              void connect()
            }}
          >
            {isConnecting ? en.createWallet.connecting : en.createWallet.connectBtn}
          </PrimaryButton>
        </ButtonRow>
        {isConnected && (
          <StatusMessage $type={Status.success}>{en.createWallet.metaMaskSuccess}</StatusMessage>
        )}
        {error !== null && !isConnected && (
          <StatusMessage $type={Status.error}>{error}</StatusMessage>
        )}
      </PageWrapper>
    )
  }

  if (step === 'password') {
    return (
      <PageWrapper>
        <StepLabel>{en.createWallet.steps.password}</StepLabel>
        <ProgressDots>
          {STEPS.slice(0, -1).map((s, i) => (
            <Dot key={s} $active={i === stepIndex} $done={i < stepIndex} />
          ))}
        </ProgressDots>
        <Title>{en.createWallet.steps.password}</Title>
        <Form>
          <InputGroup>
            <Label htmlFor="pw">{en.createWallet.passwordLabel}</Label>
            <TextInput
              id="pw"
              type="password"
              placeholder={en.createWallet.passwordPlaceholder}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError(null)
              }}
            />
          </InputGroup>
          <InputGroup>
            <Label htmlFor="pw-confirm">{en.createWallet.confirmLabel}</Label>
            <TextInput
              id="pw-confirm"
              type="password"
              placeholder={en.createWallet.confirmPlaceholder}
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value)
                setPasswordError(null)
              }}
            />
          </InputGroup>
          {passwordError !== null && <ErrorText>{passwordError}</ErrorText>}
        </Form>
        <ButtonRow>
          <SecondaryButton
            onClick={() => {
              setStep('idle')
            }}
          >
            {en.createWallet.backBtn}
          </SecondaryButton>
          <PrimaryButton onClick={handlePasswordNext}>{en.createWallet.nextBtn}</PrimaryButton>
        </ButtonRow>
      </PageWrapper>
    )
  }

  if (step === 'phrase' && wallet !== null) {
    const words = wallet.mnemonic.split(' ')
    return (
      <PageWrapper>
        <StepLabel>{en.createWallet.steps.phrase}</StepLabel>
        <ProgressDots>
          {STEPS.slice(0, -1).map((s, i) => (
            <Dot key={s} $active={i === stepIndex} $done={i < stepIndex} />
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
              setAcknowledged(e.target.checked)
            }}
          />
          {en.createWallet.phraseAcknowledge}
        </CheckboxRow>
        <ButtonRow>
          <SecondaryButton
            onClick={() => {
              setStep('password')
            }}
          >
            {en.createWallet.backBtn}
          </SecondaryButton>
          <PrimaryButton disabled={!acknowledged} onClick={handlePhraseNext}>
            {en.createWallet.nextBtn}
          </PrimaryButton>
        </ButtonRow>
      </PageWrapper>
    )
  }

  if (step === 'verify' && wallet !== null) {
    return (
      <PageWrapper>
        <StepLabel>{en.createWallet.steps.verify}</StepLabel>
        <ProgressDots>
          {STEPS.slice(0, -1).map((s, i) => (
            <Dot key={s} $active={i === stepIndex} $done={i < stepIndex} />
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
                  const updated = [...verifyAnswers]
                  updated[i] = e.target.value
                  setVerifyAnswers(updated)
                  setVerifyError(null)
                }}
              />
            </InputGroup>
          ))}
        </VerifyGrid>
        {verifyError !== null && <ErrorText>{verifyError}</ErrorText>}
        {error !== null && <StatusMessage $type={Status.error}>{error}</StatusMessage>}
        <ButtonRow>
          <SecondaryButton
            onClick={() => {
              setStep('phrase')
            }}
          >
            {en.createWallet.backBtn}
          </SecondaryButton>
          <PrimaryButton disabled={isConnecting} onClick={() => { void handleVerify() }}>
            {isConnecting ? en.createWallet.connecting : en.createWallet.verifyBtn}
          </PrimaryButton>
        </ButtonRow>
      </PageWrapper>
    )
  }

  if (step === 'complete' && wallet !== null) {
    return (
      <PageWrapper>
        <Title>{en.createWallet.steps.complete}</Title>
        <StatusMessage $type={Status.success}>{en.createWallet.walletCreated}</StatusMessage>
        <Card>
          <CardLabel>{en.createWallet.addressLabel}</CardLabel>
          <CardValue>{wallet.address}</CardValue>
        </Card>
        <ButtonRow>
          <SecondaryButton
            onClick={() => {
              void handleDownload()
            }}
          >
            {en.createWallet.downloadBtn}
          </SecondaryButton>
          <PrimaryButton
            onClick={() => {
              navigate(routes.balance)
            }}
          >
            {en.createWallet.goToBalance}
          </PrimaryButton>
        </ButtonRow>
      </PageWrapper>
    )
  }

  return null
}

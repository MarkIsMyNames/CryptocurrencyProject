import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../context/useWallet'
import { generateWallet, downloadKeystore } from '../../utils/wallet'
import type { GeneratedWallet } from '../../utils/wallet'
import { Status, routes } from '../../config'
import en from '../../locales/en.json'
import { StatusMessage } from '../../styles/shared.styles'
import { PageWrapper, Title, Subtitle, ButtonRow, PrimaryButton } from './CreateWallet.styles'
import { PasswordStep } from './PasswordStep'
import { PhraseStep } from './PhraseStep'
import { VerifyStep } from './VerifyStep'
import { CompleteStep } from './CompleteStep'

type Step = 'idle' | 'password' | 'phrase' | 'verify' | 'complete'

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
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [verifyIndices, setVerifyIndices] = useState<number[]>([])
  const [verifyAnswers, setVerifyAnswers] = useState<string[]>(['', '', ''])
  const [verifyError, setVerifyError] = useState<string | null>(null)

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

  if (step === 'password') {
    return (
      <PasswordStep
        password={password}
        confirm={confirm}
        showPassword={showPassword}
        passwordError={passwordError}
        onPasswordChange={(v) => { setPassword(v); setPasswordError(null) }}
        onConfirmChange={(v) => { setConfirm(v); setPasswordError(null) }}
        onToggleShow={() => { setShowPassword((v) => !v) }}
        onBack={() => { setStep('idle') }}
        onNext={handlePasswordNext}
      />
    )
  }

  if (step === 'phrase' && wallet !== null) {
    return (
      <PhraseStep
        mnemonic={wallet.mnemonic}
        acknowledged={acknowledged}
        onAcknowledge={setAcknowledged}
        onBack={() => { setStep('password') }}
        onNext={() => { setStep('verify') }}
      />
    )
  }

  if (step === 'verify' && wallet !== null) {
    return (
      <VerifyStep
        verifyIndices={verifyIndices}
        verifyAnswers={verifyAnswers}
        verifyError={verifyError}
        connectError={error}
        isConnecting={isConnecting}
        onAnswerChange={(i, v) => {
          const updated = [...verifyAnswers]
          updated[i] = v
          setVerifyAnswers(updated)
          setVerifyError(null)
        }}
        onBack={() => { setStep('phrase') }}
        onVerify={() => { void handleVerify() }}
      />
    )
  }

  if (step === 'complete' && wallet !== null) {
    return (
      <CompleteStep
        address={wallet.address}
        onDownload={() => { void handleDownload() }}
        onGoToBalance={() => { navigate(routes.balance) }}
      />
    )
  }

  return (
    <PageWrapper>
      <Title>{en.createWallet.title}</Title>
      <Subtitle>{en.createWallet.subtitle}</Subtitle>
      <ButtonRow>
        <PrimaryButton onClick={handleStartGenerate}>{en.createWallet.generateBtn}</PrimaryButton>
        <PrimaryButton
          disabled={isConnecting || isConnected}
          onClick={() => { void connect() }}
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

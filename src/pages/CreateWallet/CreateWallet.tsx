import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../context/useWallet'
import { generateWallet, downloadKeystore, loadKeystore, decryptKeystore } from '../../utils/wallet'
import type { GeneratedWallet } from '../../utils/wallet'
import { Status, routes, config, CreateWalletStep } from '../../config'
import en from '../../locales/en.json'
import { StatusMessage } from '../../styles/shared.styles'
import { PageWrapper, Title, Subtitle, ButtonRow, PrimaryButton } from './CreateWallet.styles'
import { PasswordStep } from './PasswordStep/PasswordStep'
import { PhraseStep } from './PhraseStep/PhraseStep'
import { VerifyStep } from './VerifyStep/VerifyStep'
import { CompleteStep } from './CompleteStep/CompleteStep'
import { KeystoreFileStep } from './KeystoreFileStep/KeystoreFileStep'
import { KeystorePasswordStep } from './KeystorePasswordStep/KeystorePasswordStep'

function pickVerifyIndices(mnemonic: string): number[] {
  const wordCount = mnemonic.split(' ').length
  const indices = new Set<number>()
  while (indices.size < config.createWalletVerifyCount) {
    indices.add(Math.floor(Math.random() * wordCount))
  }
  return [...indices].sort((a, b) => a - b)
}

export function CreateWallet() {
  const navigate = useNavigate()
  const { connect, connectWithWallet, isConnecting, error } = useWallet()

  const [step, setStep] = useState<CreateWalletStep>(CreateWalletStep.idle)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [wallet, setWallet] = useState<GeneratedWallet | null>(null)
  const [acknowledged, setAcknowledged] = useState(false)
  const [verifyIndices, setVerifyIndices] = useState<number[]>([])
  const [verifyAnswers, setVerifyAnswers] = useState<string[]>(
    Array(config.createWalletVerifyCount).fill(''),
  )
  const [verifyError, setVerifyError] = useState<string | null>(null)
  const [keystoreJson, setKeystoreJson] = useState<string | null>(null)
  const [keystorePassword, setKeystorePassword] = useState('')
  const [keystoreFileError, setKeystoreFileError] = useState<string | null>(null)
  const [keystorePasswordError, setKeystorePasswordError] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [idleSuccess, setIdleSuccess] = useState<string | null>(null)

  function handleStartGenerate() {
    setIdleSuccess(null)
    setPassword('')
    setConfirm('')
    setPasswordError(null)
    setStep(CreateWalletStep.password)
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
    setVerifyAnswers(Array(config.createWalletVerifyCount).fill(''))
    setVerifyError(null)
    setStep(CreateWalletStep.phrase)
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
    if (success) setStep(CreateWalletStep.complete)
  }

  async function handleDownload() {
    if (!wallet) return
    await downloadKeystore(wallet, password)
  }

  async function handleKeystoreFileSelect(file: File) {
    setKeystoreFileError(null)
    try {
      const json = await loadKeystore(file)
      setKeystoreJson(json)
      setKeystorePassword('')
      setKeystorePasswordError(null)
      setStep(CreateWalletStep.keystorePassword)
    } catch {
      setKeystoreFileError(en.createWallet.keystoreFileError)
    }
  }

  async function handleKeystoreDecrypt() {
    if (!keystoreJson) return
    setIsDecrypting(true)
    setKeystorePasswordError(null)
    try {
      const privateKey = await decryptKeystore(keystoreJson, keystorePassword)
      const success = await connectWithWallet(privateKey)
      if (success) {
        setStep(CreateWalletStep.idle)
        setIdleSuccess(en.createWallet.keystoreConnected)
      }
    } catch {
      setKeystorePasswordError(en.createWallet.keystorePasswordError)
    } finally {
      setIsDecrypting(false)
    }
  }

  if (step === CreateWalletStep.keystoreFile) {
    return (
      <KeystoreFileStep
        fileError={keystoreFileError}
        onFileSelect={(file) => {
          void handleKeystoreFileSelect(file)
        }}
        onBack={() => {
          setKeystoreJson(null)
          setKeystoreFileError(null)
          setStep(CreateWalletStep.idle)
        }}
      />
    )
  }

  if (step === CreateWalletStep.keystorePassword) {
    return (
      <KeystorePasswordStep
        password={keystorePassword}
        passwordError={keystorePasswordError}
        isDecrypting={isDecrypting}
        onPasswordChange={(v) => {
          setKeystorePassword(v)
        }}
        onBack={() => {
          setKeystorePasswordError(null)
          setKeystorePassword('')
          setStep(CreateWalletStep.keystoreFile)
        }}
        onDecrypt={() => {
          void handleKeystoreDecrypt()
        }}
      />
    )
  }

  if (step === CreateWalletStep.password) {
    return (
      <PasswordStep
        password={password}
        confirm={confirm}
        showPassword={showPassword}
        passwordError={passwordError}
        onPasswordChange={(v) => {
          setPassword(v)
          setPasswordError(null)
        }}
        onConfirmChange={(v) => {
          setConfirm(v)
          setPasswordError(null)
        }}
        onToggleShow={() => {
          setShowPassword((v) => !v)
        }}
        onBack={() => {
          setStep(CreateWalletStep.idle)
        }}
        onNext={handlePasswordNext}
      />
    )
  }

  if (step === CreateWalletStep.phrase && wallet !== null) {
    return (
      <PhraseStep
        mnemonic={wallet.mnemonic}
        acknowledged={acknowledged}
        onAcknowledge={setAcknowledged}
        onBack={() => {
          setStep(CreateWalletStep.password)
        }}
        onNext={() => {
          setStep(CreateWalletStep.verify)
        }}
      />
    )
  }

  if (step === CreateWalletStep.verify && wallet !== null) {
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
        onBack={() => {
          setStep(CreateWalletStep.phrase)
        }}
        onVerify={() => {
          void handleVerify()
        }}
      />
    )
  }

  if (step === CreateWalletStep.complete && wallet !== null) {
    return (
      <CompleteStep
        address={wallet.address}
        onDownload={() => {
          void handleDownload()
        }}
        onGoToBalance={() => {
          navigate(routes.balance)
        }}
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
          disabled={isConnecting}
          onClick={() => {
            setIdleSuccess(null)
            void connect().then((success) => {
              if (success) setIdleSuccess(en.createWallet.metaMaskSuccess)
            })
          }}
        >
          {isConnecting ? en.createWallet.connecting : en.createWallet.connectBtn}
        </PrimaryButton>
        <PrimaryButton
          onClick={() => {
            setIdleSuccess(null)
            setStep(CreateWalletStep.keystoreFile)
          }}
        >
          {en.createWallet.importKeystoreBtn}
        </PrimaryButton>
      </ButtonRow>
      {idleSuccess !== null && <StatusMessage $type={Status.success}>{idleSuccess}</StatusMessage>}
      {error !== null && <StatusMessage $type={Status.error}>{error}</StatusMessage>}
    </PageWrapper>
  )
}

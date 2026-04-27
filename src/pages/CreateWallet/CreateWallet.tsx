import { useState } from 'react'
import { useWallet } from '../../context/WalletContext'
import { generateWallet, downloadKeystore } from '../../utils/wallet'
import type { GeneratedWallet } from '../../utils/wallet'
import en from '../../locales/en.json'
import {
  PageWrapper,
  Title,
  Subtitle,
  ButtonRow,
  PrimaryButton,
  WarningBox,
  Card,
  CardLabel,
  CardValue,
  SecondaryButton,
} from './CreateWallet.styles'

export function CreateWallet() {
  const { connect, isConnecting } = useWallet()
  const [generated, setGenerated] = useState<GeneratedWallet | null>(null)
  const [keyRevealed, setKeyRevealed] = useState(false)

  function handleGenerate() {
    setGenerated(generateWallet())
    setKeyRevealed(false)
  }

  async function handleDownload() {
    if (!generated) return
    const password = window.prompt(en.createWallet.passwordPrompt)
    if (password === null) return
    await downloadKeystore(generated, password)
  }

  return (
    <PageWrapper>
      <Title>{en.createWallet.title}</Title>
      <Subtitle>{en.createWallet.subtitle}</Subtitle>
      <ButtonRow>
        <PrimaryButton onClick={handleGenerate}>{en.createWallet.generateBtn}</PrimaryButton>
        <PrimaryButton
          disabled={isConnecting}
          onClick={() => {
            void connect()
          }}
        >
          {isConnecting ? en.createWallet.connecting : en.createWallet.connectBtn}
        </PrimaryButton>
      </ButtonRow>

      {generated !== null && (
        <>
          <WarningBox>{en.createWallet.warning}</WarningBox>

          <Card>
            <CardLabel>{en.createWallet.addressLabel}</CardLabel>
            <CardValue>{generated.address}</CardValue>
          </Card>

          <Card>
            <CardLabel>{en.createWallet.mnemonicLabel}</CardLabel>
            <CardValue>{generated.mnemonic}</CardValue>
          </Card>

          <Card>
            <CardLabel>{en.createWallet.privateKeyLabel}</CardLabel>
            <CardValue>
              {keyRevealed ? generated.privateKey : '••••••••••••••••••••••••••••••••'}
            </CardValue>
            <SecondaryButton
              onClick={() => {
                setKeyRevealed((v) => !v)
              }}
            >
              {keyRevealed ? en.createWallet.hideKey : en.createWallet.revealKey}
            </SecondaryButton>
          </Card>

          <PrimaryButton
            onClick={() => {
              void handleDownload()
            }}
          >
            {en.createWallet.downloadBtn}
          </PrimaryButton>
        </>
      )}
    </PageWrapper>
  )
}

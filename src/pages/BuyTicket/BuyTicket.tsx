import { useState, useEffect } from 'react'
import { useWallet } from '../../context/useWallet'
import { remainingTickets, buyTicket, decodeContractError } from '../../utils/contract'
import { config, Status } from '../../config'
import strings from '../../locales/en.json'
import { type StatusType } from '../../styles/shared.styles'
import {
  PageWrapper,
  Title,
  Subtitle,
  InfoCard,
  InfoRow,
  InfoLabel,
  InfoValue,
  PrimaryActionButton,
  StatusMessage,
  ConnectPrompt,
} from './BuyTicket.styles'

export function BuyTicket() {
  const { signer, provider, isConnected, etkBalance, refreshBalances } = useWallet()
  const [remaining, setRemaining] = useState<bigint | null>(null)
  const [status, setStatus] = useState<StatusType>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!provider) return
    void remainingTickets(provider).then(setRemaining)
  }, [provider])

  const isSoldOut = remaining !== null && remaining === 0n
  const alreadyOwned = etkBalance !== null && etkBalance > 0n
  const isPending = status === Status.pending
  const isSuccess = status === Status.success
  const isDisabled = isPending || alreadyOwned || isSoldOut || isSuccess

  async function handleBuy() {
    if (!signer) return
    setStatus(Status.pending)
    setStatusMessage(strings.buyTicket.pending)
    try {
      const tx = await buyTicket(signer, BigInt(config.ticketPriceWei))
      await tx.wait()
      setStatus(Status.success)
      setStatusMessage(strings.buyTicket.success)
      await refreshBalances()
    } catch (err) {
      setStatus(Status.error)
      setStatusMessage(decodeContractError(err))
    }
  }

  return (
    <PageWrapper>
      <Title>{strings.buyTicket.title}</Title>
      <Subtitle>{strings.buyTicket.subtitle}</Subtitle>
      <InfoCard>
        <InfoRow>
          <InfoLabel>{strings.buyTicket.priceLabel}</InfoLabel>
          <InfoValue>{config.ticketPriceDisplay}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>{strings.buyTicket.remainingLabel}</InfoLabel>
          <InfoValue>{remaining !== null ? String(remaining) : '—'}</InfoValue>
        </InfoRow>
        {isConnected && (
          <InfoRow>
            <InfoLabel>{strings.buyTicket.yourBalanceLabel}</InfoLabel>
            <InfoValue>{etkBalance !== null ? String(etkBalance) : '—'}</InfoValue>
          </InfoRow>
        )}
      </InfoCard>
      {isConnected ? (
        <PrimaryActionButton
          onClick={() => {
            void handleBuy()
          }}
          disabled={isDisabled}
        >
          {strings.buyTicket.buyBtn}
        </PrimaryActionButton>
      ) : (
        <ConnectPrompt>{strings.buyTicket.connectFirst}</ConnectPrompt>
      )}
      {status !== null && <StatusMessage $type={status}>{statusMessage}</StatusMessage>}
    </PageWrapper>
  )
}

import { useState, useEffect } from 'react'
import { parseEther } from 'ethers'
import { useWallet } from '../../context/useWallet'
import { balanceOf, remainingTickets, buyTicket as contractBuyTicket, decodeContractError } from '../../utils/contract'
import { config } from '../../config'
import strings from '../../locales/en.json'
import {
  PageWrapper,
  Title,
  Subtitle,
  InfoCard,
  InfoRow,
  InfoLabel,
  InfoValue,
  BuyButton,
  StatusMessage,
  ConnectPrompt,
} from './BuyTicket.styles'

type StatusType = 'success' | 'error' | 'pending' | null

export function BuyTicket() {
  const { signer, provider, address, isConnected, refreshBalances } = useWallet()
  const [remaining, setRemaining] = useState<bigint | null>(null)
  const [ownedTickets, setOwnedTickets] = useState<bigint | null>(null)
  const [status, setStatus] = useState<StatusType>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!provider || !address) return
    void Promise.all([remainingTickets(provider), balanceOf(provider, address)]).then(
      ([rem, owned]) => {
        setRemaining(rem)
        setOwnedTickets(owned)
      },
    )
  }, [provider, address])

  const isSoldOut = remaining !== null && remaining === BigInt(0)
  const alreadyOwned = ownedTickets !== null && ownedTickets > BigInt(0)
  const isPending = status === 'pending'
  const isSuccess = status === 'success'
  const isDisabled = isPending || alreadyOwned || isSoldOut || isSuccess

  async function handleBuy() {
    if (!signer) return
    setStatus('pending')
    setStatusMessage(strings.buyTicket.pending)
    try {
      const tx = await contractBuyTicket(signer, parseEther('0.01'))
      await tx.wait()
      setStatus('success')
      setStatusMessage(strings.buyTicket.success)
      await refreshBalances()
    } catch (err) {
      const key = decodeContractError(err)
      const buyTicketStrings: Partial<Record<string, string>> = strings.buyTicket
      const errorsStrings: Partial<Record<string, string>> = strings.errors
      const message = buyTicketStrings[key] ?? errorsStrings[key] ?? strings.errors.unknownError
      setStatus('error')
      setStatusMessage(message)
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
            <InfoValue>{ownedTickets !== null ? String(ownedTickets) : '—'}</InfoValue>
          </InfoRow>
        )}
      </InfoCard>
      {isConnected ? (
        <BuyButton
          onClick={() => {
            void handleBuy()
          }}
          disabled={isDisabled}
        >
          {strings.buyTicket.buyBtn}
        </BuyButton>
      ) : (
        <ConnectPrompt>{strings.buyTicket.connectFirst}</ConnectPrompt>
      )}
      {status !== null && <StatusMessage $type={status}>{statusMessage}</StatusMessage>}
    </PageWrapper>
  )
}

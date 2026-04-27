import { useState, useEffect } from 'react'
import { parseEther, type ContractTransactionResponse } from 'ethers'
import { useWallet } from '../../context/WalletContext'
import { getContract, decodeContractError } from '../../utils/contract'
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
    const contract = getContract(provider)
    void Promise.all([
      contract.remainingTickets(),
      contract.balanceOf(address),
    ]).then(([rem, owned]) => {
      setRemaining(BigInt(String(rem)))
      setOwnedTickets(BigInt(String(owned)))
    })
  }, [provider, address])

  const isSoldOut = remaining !== null && remaining === BigInt(0)
  const alreadyOwned = ownedTickets !== null && ownedTickets > BigInt(0)
  const isPending = status === 'pending'
  const isSuccess = status === 'success'
  const isDisabled = isPending || alreadyOwned || isSoldOut || isSuccess

  async function handleBuy() {
    if (!signer) return
    const contract = getContract(signer)
    setStatus('pending')
    setStatusMessage(strings.buyTicket.pending)
    try {
      const tx = (await contract.buyTicket({ value: parseEther('0.01') })) as ContractTransactionResponse
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
          onClick={() => { void handleBuy() }}
          disabled={isDisabled}
        >
          {strings.buyTicket.buyBtn}
        </BuyButton>
      ) : (
        <ConnectPrompt>{strings.buyTicket.connectFirst}</ConnectPrompt>
      )}
      {status !== null && (
        <StatusMessage $type={status}>{statusMessage}</StatusMessage>
      )}
    </PageWrapper>
  )
}

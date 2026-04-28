import { useState, useEffect } from 'react'
import { useWallet } from '../../context/useWallet'
import { balanceOf, redeemTicket as contractRedeemTicket, decodeContractError } from '../../utils/contract'
import strings from '../../locales/en.json'
import {
  PageWrapper,
  Title,
  Subtitle,
  TicketCard,
  FieldLabel,
  FieldValue,
  TicketStatusBadge,
  RedeemButton,
  StatusMessage,
  ConnectPrompt,
} from './RedeemTicket.styles'

type StatusType = 'success' | 'error' | 'pending' | null

export function RedeemTicket() {
  const { signer, provider, address, isConnected, refreshBalances } = useWallet()
  const [ticketBalance, setTicketBalance] = useState<bigint | null>(null)
  const [status, setStatus] = useState<StatusType>(null)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    if (!provider || !address) return
    void balanceOf(provider, address).then((bal) => {
      setTicketBalance(bal)
    })
  }, [provider, address])

  const hasTicket = ticketBalance !== null && ticketBalance > 0n
  const isPending = status === 'pending'
  const isSuccess = status === 'success'
  const isDisabled = isPending || !hasTicket || isSuccess

  async function handleRedeem() {
    if (!signer) return
    setStatus('pending')
    setStatusMessage(strings.redeem.pending)
    try {
      const tx = await contractRedeemTicket(signer)
      await tx.wait()
      setStatus('success')
      setStatusMessage(strings.redeem.success)
      setTicketBalance(0n)
      await refreshBalances()
    } catch (err) {
      setStatus('error')
      setStatusMessage(decodeContractError(err))
    }
  }

  return (
    <PageWrapper>
      <Title>{strings.redeem.title}</Title>
      <Subtitle>{strings.redeem.subtitle}</Subtitle>
      {isConnected ? (
        <>
          <TicketCard>
            <FieldLabel>{strings.redeem.yourAddress}</FieldLabel>
            <FieldValue>{address}</FieldValue>
          </TicketCard>
          <TicketCard>
            <FieldLabel>{strings.redeem.ticketStatus}</FieldLabel>
            <TicketStatusBadge $valid={hasTicket}>
              {hasTicket ? strings.redeem.hasTicket : strings.redeem.noTicket}
            </TicketStatusBadge>
          </TicketCard>
          <RedeemButton
            onClick={() => {
              void handleRedeem()
            }}
            disabled={isDisabled}
          >
            {strings.redeem.redeemBtn}
          </RedeemButton>
          {status !== null && <StatusMessage $type={status}>{statusMessage}</StatusMessage>}
        </>
      ) : (
        <ConnectPrompt>{strings.redeem.connectFirst}</ConnectPrompt>
      )}
    </PageWrapper>
  )
}

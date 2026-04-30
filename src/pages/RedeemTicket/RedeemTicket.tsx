import { useState } from 'react'
import { useWallet, useConnectedWallet } from '../../context/useWallet'
import { redeemTicket, decodeContractError } from '../../utils/contract'
import { Status } from '../../config'
import strings from '../../locales/en.json'
import { type StatusType } from '../../styles/shared.styles'
import { TxReceipt } from '../../components/TxReceipt/TxReceipt'
import {
  PageWrapper,
  Title,
  Subtitle,
  TicketCard,
  FieldLabel,
  FieldValue,
  TicketStatusBadge,
  PrimaryActionButton,
  StatusMessage,
  ConnectPrompt,
} from './RedeemTicket.styles'

function RedeemTicketConnected() {
  const { signer, address, etkBalance, refreshBalances } = useConnectedWallet()
  const [status, setStatus] = useState<StatusType>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)

  const hasTicket = etkBalance !== null && etkBalance > 0n
  const isPending = status === Status.pending
  const isSuccess = status === Status.success
  const isDisabled = isPending || !hasTicket || isSuccess

  async function handleRedeem() {
    setStatus(Status.pending)
    setStatusMessage(strings.redeem.pending)
    try {
      const tx = await redeemTicket(signer)
      setTxHash(tx.hash)
      await tx.wait()
      setStatus(Status.success)
      setStatusMessage(strings.redeem.success)
      await refreshBalances()
    } catch (err) {
      setStatus(Status.error)
      setStatusMessage(decodeContractError(err))
    }
  }

  return (
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
      <PrimaryActionButton
        onClick={() => {
          void handleRedeem()
        }}
        disabled={isDisabled}
      >
        {strings.redeem.redeemBtn}
      </PrimaryActionButton>
      {status !== null && <StatusMessage $type={status}>{statusMessage}</StatusMessage>}
      {txHash !== null && <TxReceipt hash={txHash} />}
    </>
  )
}

export function RedeemTicket() {
  const { isConnected } = useWallet()

  return (
    <PageWrapper>
      <Title>{strings.redeem.title}</Title>
      <Subtitle>{strings.redeem.subtitle}</Subtitle>
      {isConnected ? <RedeemTicketConnected /> : <ConnectPrompt>{strings.redeem.connectFirst}</ConnectPrompt>}
    </PageWrapper>
  )
}

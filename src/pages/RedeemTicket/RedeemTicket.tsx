import { useState } from 'react'
import { useWallet } from '../../context/useWallet'
import { redeemTicket, decodeContractError } from '../../utils/contract'
import { Status } from '../../config'
import strings from '../../locales/en.json'
import { type StatusType } from '../../styles/shared.styles'
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
  TxCard,
  TxLabel,
  TxHash,
  TxLink,
} from './RedeemTicket.styles'

export function TxReceipt({ hash }: { hash: string }) {
  return (
    <TxCard>
      <TxLabel>{strings.redeem.txHashLabel}</TxLabel>
      <TxHash>{hash}</TxHash>
      <TxLink
        href={`https://sepolia.etherscan.io/tx/${hash}`}
        target="_blank"
        rel="noreferrer"
      >
        {strings.redeem.viewOnEtherscan}
      </TxLink>
    </TxCard>
  )
}

export function RedeemTicket() {
  const { signer, address, isConnected, etkBalance, refreshBalances } = useWallet()
  const [status, setStatus] = useState<StatusType>(null)
  const [statusMessage, setStatusMessage] = useState('')
  const [txHash, setTxHash] = useState<string | null>(null)

  const hasTicket = etkBalance !== null && etkBalance > 0n
  const isPending = status === Status.pending
  const isSuccess = status === Status.success
  const isDisabled = isPending || !hasTicket || isSuccess

  async function handleRedeem() {
    if (!signer) return
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
      ) : (
        <ConnectPrompt>{strings.redeem.connectFirst}</ConnectPrompt>
      )}
    </PageWrapper>
  )
}

import { useState, useEffect } from 'react'
import type { ContractTransactionResponse } from 'ethers'
import { useWallet } from '../../context/WalletContext'
import { getContract, decodeContractError } from '../../utils/contract'
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
    const contract = getContract(provider)
    void contract.balanceOf(address).then((bal) => {
      setTicketBalance(BigInt(String(bal)))
    })
  }, [provider, address])

  const hasTicket = ticketBalance !== null && ticketBalance > 0n
  const isPending = status === 'pending'
  const isSuccess = status === 'success'
  const isDisabled = isPending || !hasTicket || isSuccess

  async function handleRedeem() {
    if (!signer) return
    const contract = getContract(signer)
    setStatus('pending')
    setStatusMessage(strings.redeem.pending)
    try {
      const tx = (await contract.redeemTicket()) as ContractTransactionResponse
      await tx.wait()
      setStatus('success')
      setStatusMessage(strings.redeem.success)
      setTicketBalance(0n)
      await refreshBalances()
    } catch (err) {
      const key = decodeContractError(err)
      const redeemStrings: Partial<Record<string, string>> = strings.redeem
      const errorsStrings: Partial<Record<string, string>> = strings.errors
      const message = redeemStrings[key] ?? errorsStrings[key] ?? strings.errors.unknownError
      setStatus('error')
      setStatusMessage(message)
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

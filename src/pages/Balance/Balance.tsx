import { useState } from 'react'
import { isAddress, formatEther } from 'ethers'
import { useWallet } from '../../context/useWallet'
import { balanceOf, remainingTickets, decodeContractError } from '../../utils/contract'
import { config } from '../../config'
import strings from '../../locales/en.json'
import {
  PageWrapper,
  Title,
  Subtitle,
  InputRow,
  AddressInput,
  CheckButton,
  BalanceGrid,
  BalanceCard,
  BalanceLabel,
  BalanceValue,
  TicketBadge,
  ErrorMessage,
} from './Balance.styles'

interface BalanceResult {
  seth: string
  etk: bigint
  remaining: bigint
}

export function BalanceResultView({ seth, etk, remaining }: BalanceResult) {
  return (
    <BalanceGrid>
      <BalanceCard>
        <BalanceLabel>{strings.balance.sethLabel}</BalanceLabel>
        <BalanceValue>{`${parseFloat(seth).toFixed(4)} SETH`}</BalanceValue>
      </BalanceCard>
      <BalanceCard>
        <BalanceLabel>{strings.balance.etkLabel}</BalanceLabel>
        <BalanceValue>{etk.toString()}</BalanceValue>
        <TicketBadge $valid={etk > 0n}>
          {etk > 0n ? strings.balance.ticketValid : strings.balance.ticketNone}
        </TicketBadge>
      </BalanceCard>
      <BalanceCard>
        <BalanceLabel>{strings.balance.supplyLabel}</BalanceLabel>
        <BalanceValue>
          {remaining.toString()} / {config.defaultTicketSupply}
        </BalanceValue>
      </BalanceCard>
    </BalanceGrid>
  )
}

export function Balance() {
  const { provider, address: connectedAddress } = useWallet()
  const [inputAddress, setInputAddress] = useState(connectedAddress ?? '')
  const [result, setResult] = useState<BalanceResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheck() {
    setError(null)
    if (!isAddress(inputAddress)) {
      setError(strings.balance.invalidAddress)
      return
    }
    if (!provider) {
      setError(strings.errors.connectWallet)
      return
    }
    setLoading(true)
    try {
      const [rawEth, etk, remaining] = await Promise.all([
        provider.getBalance(inputAddress),
        balanceOf(provider, inputAddress),
        remainingTickets(provider),
      ])
      setResult({
        seth: formatEther(rawEth),
        etk,
        remaining,
      })
    } catch (err) {
      setError(decodeContractError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrapper>
      <Title>{strings.balance.title}</Title>
      <Subtitle>{strings.balance.subtitle}</Subtitle>

      <InputRow>
        <AddressInput
          placeholder={strings.balance.placeholder}
          value={inputAddress}
          onChange={(e) => {
            setInputAddress(e.target.value)
          }}
        />
        <CheckButton
          onClick={() => {
            void handleCheck()
          }}
          disabled={loading}
        >
          {loading ? '...' : strings.balance.checkBtn}
        </CheckButton>
      </InputRow>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {result && <BalanceResultView {...result} />}
    </PageWrapper>
  )
}

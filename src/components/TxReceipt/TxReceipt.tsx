import strings from '../../locales/en.json'
import { TxCard, TxLabel, TxHash, TxLink } from './TxReceipt.styles'

export function TxReceipt({ hash }: { hash: string }) {
  return (
    <TxCard>
      <TxLabel>{strings.txReceipt.txHashLabel}</TxLabel>
      <TxHash>{hash}</TxHash>
      <TxLink href={`https://sepolia.etherscan.io/tx/${hash}`} target="_blank" rel="noreferrer">
        {strings.txReceipt.viewOnEtherscan}
      </TxLink>
    </TxCard>
  )
}

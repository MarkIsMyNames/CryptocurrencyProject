import { useWallet } from '../../context/WalletContext'
import strings from '../../locales/en.json'
import { StatusWrapper, StatusDot, StatusText } from './WalletStatus.styles'

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function WalletStatus() {
  const { isConnected, address } = useWallet()

  return (
    <StatusWrapper>
      <StatusDot $connected={isConnected} />
      <StatusText>
        {isConnected && address
          ? truncateAddress(address)
          : strings.walletStatus.disconnected}
      </StatusText>
    </StatusWrapper>
  )
}

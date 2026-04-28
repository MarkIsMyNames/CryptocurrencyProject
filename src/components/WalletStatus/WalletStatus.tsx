import { useWallet } from '../../context/useWallet'
import strings from '../../locales/en.json'
import { truncateAddress } from '../../utils/wallet'
import { StatusWrapper, StatusDot, StatusText } from './WalletStatus.styles'

export function WalletStatus() {
  const { isConnected, address } = useWallet()

  return (
    <StatusWrapper>
      <StatusDot $connected={isConnected} />
      <StatusText>
        {isConnected && address ? truncateAddress(address) : strings.walletStatus.disconnected}
      </StatusText>
    </StatusWrapper>
  )
}

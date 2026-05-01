import { useState } from 'react'
import { useWallet } from '../../context/useWallet'
import strings from '../../locales/en.json'
import { truncateAddress } from '../../utils/wallet'
import { StatusWrapper, StatusDot, StatusText } from './WalletStatus.styles'

export function WalletStatus() {
  const { isConnected, address } = useWallet()
  const [copied, setCopied] = useState(false)

  if (isConnected && !address) {
    throw new Error(strings.errors.connectedNoAddress)
  }

  const canCopy = isConnected && address !== null

  function handleCopy() {
    if (!address) return
    void navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    })
  }

  return (
    <StatusWrapper
      as={canCopy ? 'button' : 'div'}
      $clickable={canCopy}
      onClick={canCopy ? handleCopy : undefined}
      title={canCopy ? strings.walletStatus.copyAddress : undefined}
    >
      <StatusDot $connected={isConnected} />
      <StatusText>
        {copied
          ? strings.walletStatus.copied
          : isConnected && address
            ? truncateAddress(address)
            : strings.walletStatus.disconnected}
      </StatusText>
    </StatusWrapper>
  )
}

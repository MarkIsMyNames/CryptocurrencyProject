import { Wallet } from 'ethers'

export interface GeneratedWallet {
  address: string
  privateKey: string
  mnemonic: string
}

export function generateWallet(): GeneratedWallet {
  const wallet = Wallet.createRandom()
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic?.phrase ?? '',
  }
}

export async function downloadKeystore(wallet: GeneratedWallet, password: string): Promise<void> {
  const ethersWallet = new Wallet(wallet.privateKey)
  const keystore = await ethersWallet.encrypt(password)
  const blob = new Blob([keystore], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `keystore-${wallet.address.slice(0, 8)}.json`
  a.click()
  setTimeout(() => { URL.revokeObjectURL(url) }, 100)
}

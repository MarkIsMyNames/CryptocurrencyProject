import { Wallet } from 'ethers'
import { config } from '../config'

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
  const keystoreBlob = new Blob([keystore], { type: 'application/json' })
  const downloadUrl = URL.createObjectURL(keystoreBlob)
  const anchor = document.createElement('a')
  anchor.href = downloadUrl
  anchor.download = `keystore-${wallet.address.slice(0, 8)}.json`
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(downloadUrl)
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, config.addressPrefixLength)}...${address.slice(-config.addressSuffixLength)}`
}

export function loadKeystore(file: File): Promise<string> {
  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    return Promise.reject(new Error('Not a JSON file'))
  }
  return file.text()
}

export async function decryptKeystore(json: string, password: string): Promise<string> {
  const wallet = await Wallet.fromEncryptedJson(json, password)
  return wallet.privateKey
}

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { generateWallet, downloadKeystore, truncateAddress } from './wallet'
import { config } from '../config'

vi.mock('ethers', () => {
  const mockInstance = {
    address: '0xAbCd1234AbCd1234AbCd1234AbCd1234AbCd1234',
    privateKey: '0x' + 'a'.repeat(64),
    mnemonic: {
      phrase: 'word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12',
    },
    encrypt: vi.fn().mockResolvedValue('{"mock":"keystore"}'),
  }
  class MockWallet {
    address = mockInstance.address
    privateKey = mockInstance.privateKey
    mnemonic = mockInstance.mnemonic
    encrypt = mockInstance.encrypt
    static createRandom = vi.fn().mockReturnValue(mockInstance)
  }
  return { Wallet: MockWallet }
})

describe('generateWallet', () => {
  it('returns a valid Ethereum address', () => {
    const wallet = generateWallet()
    expect(wallet.address).toMatch(/^0x[0-9a-fA-F]{40}$/)
  })

  it('returns a private key', () => {
    const wallet = generateWallet()
    expect(wallet.privateKey).toMatch(/^0x[0-9a-fA-F]{64}$/)
  })

  it('returns a 12-word mnemonic', () => {
    const wallet = generateWallet()
    expect(wallet.mnemonic.split(' ')).toHaveLength(12)
  })
})

describe('truncateAddress', () => {
  it('truncates address to prefix...suffix format', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678'
    const result = truncateAddress(address)
    expect(result).toBe(
      `${address.slice(0, config.addressPrefixLength)}...${address.slice(-config.addressSuffixLength)}`,
    )
  })
})

describe('downloadKeystore', () => {
  const revokeObjectURL = vi.fn()

  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn().mockReturnValue('blob:mock-url'),
      revokeObjectURL,
    })
  })

  it('triggers a file download with the correct filename', async () => {
    const click = vi.fn()
    const anchor = { href: '', download: '', click }
    vi.spyOn(document.body, 'appendChild').mockImplementation(() => anchor as unknown as Node)
    vi.spyOn(document.body, 'removeChild').mockImplementation(() => anchor as unknown as Node)
    vi.spyOn(document, 'createElement').mockReturnValue(anchor as unknown as HTMLAnchorElement)

    const wallet = generateWallet()
    await downloadKeystore(wallet, 'password123')

    expect(anchor.download).toBe(`keystore-${wallet.address.slice(0, 8)}.json`)
    expect(click).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
  })
})

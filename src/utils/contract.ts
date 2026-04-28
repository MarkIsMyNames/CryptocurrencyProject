import { Contract, type JsonRpcSigner, type BrowserProvider } from 'ethers'
import { config } from '../config'
import strings from '../locales/en.json'

export const EVENT_TICKET_ABI = [
  'function buyTicket() payable',
  'function redeemTicket()',
  'function remainingTickets() view returns (uint256)',
  'function balanceOf(address) view returns (uint256)',
  'function totalSupply() view returns (uint256)',
  'event TicketPurchased(address indexed buyer)',
  'event TicketRedeemed(address indexed holder)',
] as const

function getContract(signerOrProvider: JsonRpcSigner | BrowserProvider) {
  return new Contract(config.contractAddress, EVENT_TICKET_ABI, signerOrProvider)
}

export function balanceOf(signerOrProvider: JsonRpcSigner | BrowserProvider, address: string): Promise<bigint> {
  return getContract(signerOrProvider).balanceOf(address) as Promise<bigint>
}

export function remainingTickets(signerOrProvider: BrowserProvider): Promise<bigint> {
  return getContract(signerOrProvider).remainingTickets() as Promise<bigint>
}

export function buyTicket(signer: JsonRpcSigner, value: bigint): Promise<{ wait: () => Promise<unknown> }> {
  return getContract(signer).buyTicket({ value }) as Promise<{ wait: () => Promise<unknown> }>
}

export function redeemTicket(signer: JsonRpcSigner): Promise<{ wait: () => Promise<unknown> }> {
  return getContract(signer).redeemTicket() as Promise<{ wait: () => Promise<unknown> }>
}

export function decodeContractError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message
    if (msg.includes('IncorrectPayment')) return strings.errors.incorrectAmount
    if (msg.includes('AlreadyOwnsTicket')) return strings.errors.alreadyOwned
    if (msg.includes('SoldOut')) return strings.errors.soldOut
    if (msg.includes('NoTicketToRedeem')) return strings.errors.noTicket
    if (msg.includes('user rejected')) return strings.errors.cancelled
    if (msg.includes('network changed') || msg.includes('chain')) return strings.errors.wrongNetwork
  }
  return strings.errors.unknownError
}

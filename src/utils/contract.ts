import { Contract, type ContractRunner, type ContractTransactionResponse } from 'ethers'
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

interface EventTicketContract {
  balanceOf(address: string): Promise<bigint>
  remainingTickets(): Promise<bigint>
  buyTicket(overrides: { value: bigint }): Promise<ContractTransactionResponse>
  redeemTicket(): Promise<ContractTransactionResponse>
}

function getContract(signerOrProvider: ContractRunner): EventTicketContract {
  return new Contract(
    config.contractAddress,
    EVENT_TICKET_ABI,
    signerOrProvider,
  ) as unknown as EventTicketContract
}

export function balanceOf(
  signerOrProvider: ContractRunner,
  address: string,
): Promise<bigint> {
  return getContract(signerOrProvider).balanceOf(address)
}

export function remainingTickets(signerOrProvider: ContractRunner): Promise<bigint> {
  return getContract(signerOrProvider).remainingTickets()
}

export function buyTicket(
  signer: ContractRunner,
  value: bigint,
): Promise<ContractTransactionResponse> {
  return getContract(signer).buyTicket({ value })
}

export function redeemTicket(signer: ContractRunner): Promise<ContractTransactionResponse> {
  return getContract(signer).redeemTicket()
}

const CONTRACT_ERRORS: Array<[string[], string]> = [
  [['IncorrectPayment'], strings.errors.incorrectAmount],
  [['AlreadyOwnsTicket'], strings.errors.alreadyOwned],
  [['SoldOut'], strings.errors.soldOut],
  [['NoTicketToRedeem'], strings.errors.noTicket],
  [['user rejected'], strings.errors.cancelled],
  [['network changed', 'chain'], strings.errors.wrongNetwork],
]

export function decodeContractError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message
    for (const [patterns, message] of CONTRACT_ERRORS) {
      if (patterns.some((p) => msg.includes(p))) return message
    }
  }
  return strings.errors.unknownError
}

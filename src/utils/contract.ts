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
  'error IncorrectPayment(uint256 sent, uint256 required)',
  'error AlreadyOwnsTicket()',
  'error SoldOut()',
  'error NoTicketToRedeem()',
  'error WithdrawFailed()',
  'error TicketsAreNonTransferable()',
  'error NothingToWithdraw()',
  'error InvalidConfiguration()',
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

export function balanceOf(signerOrProvider: ContractRunner, address: string): Promise<bigint> {
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
  [['BAD_DATA', 'could not decode result data'], strings.errors.contractNotDeployed],
  [['IncorrectPayment', '0x0d35e921'], strings.errors.incorrectAmount],
  [['AlreadyOwnsTicket', '0x1a43bf63'], strings.errors.alreadyOwned],
  [['SoldOut', '0x52df9fe5'], strings.errors.soldOut],
  [['NoTicketToRedeem', '0xe58c3a17'], strings.errors.noTicket],
  [['user rejected'], strings.errors.cancelled],
  [['INSUFFICIENT_FUNDS', 'insufficient funds'], strings.errors.insufficientFunds],
  [['network changed', 'chain'], strings.errors.wrongNetwork],
  [['timeout', 'TIMEOUT', 'SERVER_ERROR', 'could not detect network'], strings.errors.networkError],
  [['UNCONFIGURED_NAME', 'ENS name'], strings.errors.invalidContractAddress],
]

export function decodeContractError(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message
    for (const [patterns, message] of CONTRACT_ERRORS) {
      if (patterns.some((p) => msg.includes(p))) return message
    }
    return msg
  }
  return strings.errors.unknownError
}

export const routes = {
  root: '/',
  createWallet: '/create-wallet',
  balance: '/balance',
  buyTicket: '/buy-ticket',
  redeem: '/redeem',
} as const

export const Status = {
  pending: 'pending',
  success: 'success',
  error: 'error',
} as const

function requireEnv(value: string | undefined, name: string): string {
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export const config = {
  contractAddress: requireEnv(import.meta.env.VITE_CONTRACT_ADDRESS, 'VITE_CONTRACT_ADDRESS'),
  sepoliaChainId: 11155111,
  sepoliaChainIdHex: '0xaa36a7',
  metamaskChainNotFoundCode: 4902,
  sepoliaRpcUrl: requireEnv(import.meta.env.VITE_SEPOLIA_RPC_URL, 'VITE_SEPOLIA_RPC_URL'),
  ticketPriceWei: requireEnv(import.meta.env.VITE_TICKET_PRICE_WEI, 'VITE_TICKET_PRICE_WEI'),
  ticketPriceDisplay: '0.01 SETH',
  defaultTicketSupply: Number(requireEnv(import.meta.env.VITE_MAX_SUPPLY, 'VITE_MAX_SUPPLY')),
  tokenSymbol: 'ETK',
  tokenName: 'EventTicket',
  addressPrefixLength: 6,
  addressSuffixLength: 4,
} as const

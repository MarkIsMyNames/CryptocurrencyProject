export { routes, Status } from './routes'

import { requireEnv } from '../shared/requireEnv'

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

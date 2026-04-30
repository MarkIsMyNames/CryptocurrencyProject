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

export const config = {
  contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS,
  sepoliaChainId: 11155111,
  sepoliaChainIdHex: '0xaa36a7',
  sepoliaRpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  ticketPriceWei: import.meta.env.VITE_TICKET_PRICE_WEI,
  ticketPriceDisplay: '0.01 SETH',
  defaultTicketSupply: Number(import.meta.env.VITE_MAX_SUPPLY),
  tokenSymbol: 'ETK',
  tokenName: 'EventTicket',
} as const

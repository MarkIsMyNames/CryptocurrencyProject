export const routes = {
  root: '/',
  createWallet: '/create-wallet',
  balance: '/balance',
  buyTicket: '/buy-ticket',
  redeem: '/redeem',
} as const

export const config = {
  contractAddress: (import.meta.env?.VITE_CONTRACT_ADDRESS as string | undefined) ?? '',
  sepoliaChainId: 11155111,
  sepoliaChainIdHex: '0xaa36a7',
  sepoliaRpcUrl: 'https://rpc.sepolia.org',
  ticketPriceWei: '10000000000000000',
  ticketPriceDisplay: '0.01 SETH',
  defaultTicketSupply: 1000,
  tokenSymbol: 'ETK',
  tokenName: 'EventTicket',
} as const

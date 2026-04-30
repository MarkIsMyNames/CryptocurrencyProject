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

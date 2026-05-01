export const routes = {
  root: '/',
  createWallet: '/create-wallet',
  balance: '/balance',
  buyTicket: '/buy-ticket',
  redeem: '/redeem',
} as const

export const CreateWalletStep = {
  idle: 'idle',
  password: 'password',
  phrase: 'phrase',
  verify: 'verify',
  complete: 'complete',
  keystoreFile: 'keystoreFile',
  keystorePassword: 'keystorePassword',
} as const

export type CreateWalletStep = (typeof CreateWalletStep)[keyof typeof CreateWalletStep]

export const Status = {
  pending: 'pending',
  success: 'success',
  error: 'error',
} as const

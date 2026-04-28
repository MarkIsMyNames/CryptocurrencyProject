import { useContext } from 'react'
import strings from '../locales/en.json'
import { WalletContext, type WalletContextValue } from './walletContext'

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error(strings.errors.hookOutsideProvider)
  return ctx
}

import { useEffect, useRef } from 'react'
import { useWallet } from '../context/useWallet'

export function usePendingTx(storageKey: string) {
  const { provider, isConnected, refreshBalances } = useWallet()
  const watching = useRef(false)

  useEffect(() => {
    if (!isConnected || !provider || watching.current) return
    const hash = sessionStorage.getItem(storageKey)
    if (!hash) return

    watching.current = true
    void (async () => {
      try {
        await provider.waitForTransaction(hash)
        await refreshBalances()
      } catch {
        // tx watch failed — balance will be stale until next manual refresh
      } finally {
        sessionStorage.removeItem(storageKey)
        watching.current = false
      }
    })()
  }, [isConnected, provider, storageKey, refreshBalances])

  function savePendingTx(hash: string) {
    sessionStorage.setItem(storageKey, hash)
  }

  function clearPendingTx() {
    sessionStorage.removeItem(storageKey)
  }

  return { savePendingTx, clearPendingTx }
}

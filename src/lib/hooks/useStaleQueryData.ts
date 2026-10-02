import { useRef } from 'react'

/**
 * RTK Query: keep the last successful value on screen while args change
 * and a new request is in flight (`isFetching`), instead of clearing the UI.
 */
export function useStaleQueryData<T>(
  fresh: T | undefined,
  isFetching: boolean,
  idleFallback?: T,
): T | undefined {
  const staleRef = useRef<T | undefined>(undefined)

  if (fresh !== undefined) {
    staleRef.current = fresh
  }

  if (fresh !== undefined) return fresh
  if (isFetching) return staleRef.current
  return idleFallback
}

import { atom, useAtomValue } from 'jotai'
import { RefObject, useEffect, useMemo } from 'react'
import { focusedNodeIdAtom } from '../store'

export default function useSyncFocus<T extends HTMLElement = HTMLElement>({
  nodeId,
  ref
}: {
  nodeId: string
  ref: RefObject<T>
}): void {
  const focused = useAtomValue(
    useMemo(() => atom((get) => get(focusedNodeIdAtom) === nodeId), [nodeId])
  )

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused, ref])
}

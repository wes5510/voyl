import { atom, useAtomValue } from 'jotai'
import { RefObject, useEffect, useMemo, useRef } from 'react'
import { focusedNodeIdAtom } from '../store'

export default function useSyncFocus<T extends HTMLElement = HTMLElement>({
  nodeId
}: {
  nodeId: string
}): RefObject<T> {
  const focused = useAtomValue(
    useMemo(() => atom((get) => get(focusedNodeIdAtom) === nodeId), [nodeId])
  )
  const ref = useRef<T>(null)

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused])

  return ref
}

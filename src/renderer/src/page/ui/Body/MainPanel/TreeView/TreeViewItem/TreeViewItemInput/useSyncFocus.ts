import { atom, useAtomValue, useSetAtom } from 'jotai'
import { RefObject, useCallback, useEffect, useMemo } from 'react'
import { focusedNodeIdAtom } from '@/state/tree.state'

export default function useSyncFocus<T extends HTMLElement = HTMLElement>({
  nodeId,
  ref,
}: {
  nodeId: string
  ref: RefObject<T>
}): () => void {
  const focused = useAtomValue(
    useMemo(() => atom((get) => get(focusedNodeIdAtom) === nodeId), [nodeId]),
  )
  const setFocusedNodeId = useSetAtom(focusedNodeIdAtom)

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused, ref])

  return useCallback(() => {
    setFocusedNodeId(nodeId)
  }, [nodeId, setFocusedNodeId])
}

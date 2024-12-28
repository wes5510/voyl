import useTreeStore from '@/features/tree/model'
import { isFocused } from '@/features/tree/model/tree'
import { RefObject, useCallback, useEffect } from 'react'

export default function useSyncFocus<T extends HTMLElement = HTMLElement>({
  nodeId,
  ref,
}: {
  nodeId: string
  ref: RefObject<T>
}): () => void {
  const focused = useTreeStore((state) => isFocused({ entity: state, nodeId }))
  const setFocusedNodeId = useTreeStore((state) => state.setFocusedNodeId)

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused, ref])

  return useCallback(() => {
    setFocusedNodeId(nodeId)
  }, [nodeId, setFocusedNodeId])
}

import useTreeViewStore, { isFocus } from '@/models/treeView/store'
import { RefObject, useCallback, useEffect } from 'react'

export default function useFocus<T extends HTMLElement = HTMLElement>({
  nodeId,
  ref,
}: {
  nodeId: string
  ref: RefObject<T>
}): () => void {
  const focused = useTreeViewStore((state) => isFocus({ entity: state.entity, nodeId }))
  const setFocusedNodeId = useTreeViewStore((state) => state.setFocusedNodeId)

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused, ref])

  return useCallback(() => {
    setFocusedNodeId({ nodeId })
  }, [nodeId, setFocusedNodeId])
}

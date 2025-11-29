import { RefObject, useEffect } from 'react'
import {
  useFocusedNodeId,
  setTreeViewFocusedNodeId,
} from '@/renderer/store/treeView'

export default function useFocus<T extends HTMLElement = HTMLElement>({
  nodeId,
  ref,
}: {
  nodeId: string
  ref: RefObject<T | null>
}): () => void {
  const focused = useFocusedNodeId() === nodeId

  useEffect(() => {
    if (focused) {
      ref.current?.focus()
    }
  }, [focused, nodeId, ref])

  return () => {
    setTreeViewFocusedNodeId({ nodeId })
  }
}

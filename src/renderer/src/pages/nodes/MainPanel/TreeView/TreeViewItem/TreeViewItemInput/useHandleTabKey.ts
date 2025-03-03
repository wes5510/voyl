import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './shared/util'
import { HotkeyCallback } from 'react-hotkeys-hook'
import useTreeStore, { getNodeTable } from '@/models/tree/store'
import useTreeViewStore from '@/models/treeView/store'

export default function useHandleTabKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const { indentNode, nodeTable } = useTreeStore((state) => ({
    indentNode: state.indentNode,
    nodeTable: getNodeTable({ entity: state.entity }),
  }))
  const expandNode = useTreeViewStore((state) => state.expandNode)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      const parentNodeId = indentNode({ nodeId })

      if (parentNodeId) {
        expandNode({ nodeId: parentNodeId, nodeTable })
      }

      e.preventDefault()
    },
    [nodeId, indentNode, expandNode, nodeTable],
  )
}

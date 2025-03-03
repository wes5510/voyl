import { HotkeyCallback } from 'react-hotkeys-hook'
import { useCallback } from 'react'
import { isHTMLTextAreaElement } from '../shared/util'
import useTreeViewStore, { isExpandedNode } from '@/models/treeView/store'
import { getSourceNodeTitle, getNewNodeTitle } from './util'
import useTreeStore from '@/models/tree/store'

export default function useHandleEnterKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const insertNewNodeAfter = useTreeStore((state) => state.insertNewNodeAfter)
  const { setFocusedNodeId, expanded } = useTreeViewStore((state) => ({
    setFocusedNodeId: state.setFocusedNodeId,
    expanded: isExpandedNode({ entity: state.entity, nodeId }),
  }))

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      const { value, selectionStart, selectionEnd } = e.target

      const newNodeId = insertNewNodeAfter({
        sourceNode: {
          id: nodeId,
          title: getSourceNodeTitle({
            text: value,
            selectionStart,
          }),
        },
        newNodeTitle: getNewNodeTitle({
          text: value,
          selectionEnd,
        }),
        nested: expanded,
      })

      setFocusedNodeId({ nodeId: newNodeId })
    },
    [nodeId, setFocusedNodeId, insertNewNodeAfter, expanded],
  )
}

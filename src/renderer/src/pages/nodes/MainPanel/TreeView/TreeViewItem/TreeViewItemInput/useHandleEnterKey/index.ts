import { HotkeyCallback } from 'react-hotkeys-hook'
import { useCallback } from 'react'
import { isHTMLTextAreaElement } from '../shared/util'
import useTreeStore from '@/models/nodeTable/store'
import useTreeViewStore from '@/models/treeView/store'
import { getSourceNodeTitle, getNewNodeTitle } from './util'

export default function useHandleEnterKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const { setTitle, insertNewNodeAfter } = useTreeStore((state) => ({
    setTitle: state.setTitle,
    insertNewNodeAfter: state.insertNewNodeAfter,
  }))
  const setFocusedNodeId = useTreeViewStore((state) => state.setFocusedNodeId)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      const { value, selectionStart, selectionEnd } = e.target

      setTitle({
        nodeId,
        title: getSourceNodeTitle({
          text: value,
          selectionStart,
        }),
      })

      const newNodeId = insertNewNodeAfter({
        refNodeId: nodeId,
        newNodeTitle: getNewNodeTitle({
          text: value,
          selectionEnd,
        }),
      })

      setFocusedNodeId({ nodeId: newNodeId })
    },
    [insertNewNodeAfter, nodeId, setFocusedNodeId, setTitle],
  )
}

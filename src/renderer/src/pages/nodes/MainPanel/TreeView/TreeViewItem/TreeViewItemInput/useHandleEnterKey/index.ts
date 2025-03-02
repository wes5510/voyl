import { HotkeyCallback } from 'react-hotkeys-hook'
import { useCallback } from 'react'
import { isHTMLTextAreaElement } from '../shared/util'
import useTreeViewStore from '@/models/treeView/store'
import { getSourceNodeTitle, getNewNodeTitle } from './util'
import useTreeStore from '@/models/tree/store'

export default function useHandleEnterKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const insertNewNodeAfter = useTreeStore((state) => state.insertNewNodeAfter)
  const setFocusedNodeId = useTreeViewStore((state) => state.setFocusedNodeId)

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
      })

      setFocusedNodeId({ nodeId: newNodeId })
    },
    [nodeId, setFocusedNodeId, insertNewNodeAfter],
  )
}

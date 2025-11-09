import { HotkeyCallback } from 'react-hotkeys-hook'
import { isHTMLTextAreaElement } from '../shared/util'
import { getNewNodeTitle, getSourceNodeTitle } from './util'
import { useUpdateNodeTitle } from '@/renderer/store/tree'
import {
  useAddNewNodeAfter,
  useSetFocusedNodeId,
} from '@/renderer/store/treeView'

export default function useHandleEnterKey({
  nodeId,
}: {
  nodeId: string
}): HotkeyCallback {
  const updateTitleByNodeId = useUpdateNodeTitle()
  const addNewNodeAfter = useAddNewNodeAfter()
  const setFocusedNodeId = useSetFocusedNodeId()

  return async (e: KeyboardEvent) => {
    if (!isHTMLTextAreaElement(e.target)) {
      return
    }

    const { value, selectionStart, selectionEnd } = e.target
    await updateTitleByNodeId({
      nodeId,
      title: getSourceNodeTitle({
        text: value,
        selectionStart,
      }),
    })

    const newNode = await addNewNodeAfter({
      nodeId,
      title: getNewNodeTitle({
        text: value,
        selectionEnd,
      }),
    })

    setFocusedNodeId({ nodeId: newNode.id })
  }
}

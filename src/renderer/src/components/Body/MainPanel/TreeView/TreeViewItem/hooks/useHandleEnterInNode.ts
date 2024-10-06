import { HotkeyCallback } from 'react-hotkeys-hook'
import { useSetAtom } from 'jotai'
import { textAtom } from '../store'
import { insertAfterNewNodeInTreeAtom } from '../../store'
import { useCallback } from 'react'
import { isHTMLTextAreaElement } from '../util'

const getSourceNodeText = ({
  text,
  selectionStart
}: {
  text: string
  selectionStart?: number
}): string => (selectionStart === undefined ? text : text.slice(0, selectionStart))

const getNewNodeText = ({ text, selectionEnd }: { text: string; selectionEnd?: number }): string =>
  selectionEnd ? text.slice(selectionEnd) : ''

export default function useHandleEnterInNode({ nodeId }: { nodeId: string }): HotkeyCallback {
  const setText = useSetAtom(textAtom(nodeId))
  const insertAfterNewNodeInTree = useSetAtom(insertAfterNewNodeInTreeAtom)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      const { value, selectionStart, selectionEnd } = e.target

      setText(
        getSourceNodeText({
          text: value,
          selectionStart
        })
      )

      insertAfterNewNodeInTree({
        sourceNodeId: nodeId,
        newNodeText: getNewNodeText({
          text: value,
          selectionEnd
        })
      })
    },
    [insertAfterNewNodeInTree, nodeId, setText]
  )
}

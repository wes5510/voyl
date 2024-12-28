import { HotkeyCallback } from 'react-hotkeys-hook'
import { useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import useTreeStore from '@/features/tree/model'

const getSourceNodeText = ({
  text,
  selectionStart,
}: {
  text: string
  selectionStart?: number
}): string => (selectionStart === undefined ? text : text.slice(0, selectionStart))

const getNewNodeText = ({ text, selectionEnd }: { text: string; selectionEnd?: number }): string =>
  selectionEnd ? text.slice(selectionEnd) : ''

export default function useHandleEnterKey({ nodeId }: { nodeId: string }): HotkeyCallback {
  const setTitle = useTreeStore((state) => state.setNodeTitle)
  const insertNewNodeAfter = useTreeStore((state) => state.insertNewNodeAfter)

  return useCallback(
    (e: KeyboardEvent) => {
      if (!isHTMLTextAreaElement(e.target)) {
        return
      }

      const { value, selectionStart, selectionEnd } = e.target

      setTitle({
        nodeId,
        title: getSourceNodeText({
          text: value,
          selectionStart,
        }),
      })

      insertNewNodeAfter({
        refNodeId: nodeId,
        newNodeTitle: getNewNodeText({
          text: value,
          selectionEnd,
        }),
      })
    },
    [insertNewNodeAfter, nodeId, setTitle],
  )
}

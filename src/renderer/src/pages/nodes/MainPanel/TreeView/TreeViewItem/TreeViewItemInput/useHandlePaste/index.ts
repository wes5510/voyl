import { ClipboardEventHandler, useCallback } from 'react'
import { isHTMLTextAreaElement } from '../shared/util'
import useTreeStore from '@/models/nodeTable'
import { BREAK_LINE } from './const'
import { removeNewLine, insertText } from './util'

export default function useHandlePaste({
  nodeId,
}: {
  nodeId: string
}): ClipboardEventHandler<HTMLTextAreaElement> {
  const setTitle = useTreeStore((state) => state.setTitle)

  return useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      if (!e.clipboardData.getData('text/plain').includes(BREAK_LINE)) {
        return
      }

      const { target } = e
      if (!isHTMLTextAreaElement(target)) {
        return
      }

      e.preventDefault()
      const { value, selectionStart, selectionEnd } = target
      const newText = removeNewLine(e.clipboardData.getData('text/plain'))
      setTitle({
        nodeId,
        title: insertText({
          newText,
          sourceText: value,
          selection: { start: selectionStart, end: selectionEnd },
        }),
      })

      setTimeout(() => {
        const newCaretPosition = selectionStart + newText.length
        target.selectionStart = newCaretPosition
        target.selectionEnd = newCaretPosition
        target.focus()
      }, 0)
    },
    [setTitle, nodeId],
  )
}

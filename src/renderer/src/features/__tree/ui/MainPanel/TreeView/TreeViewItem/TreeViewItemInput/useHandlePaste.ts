import { ClipboardEventHandler, useCallback } from 'react'
import { isHTMLTextAreaElement } from './util'
import useTreeStore from '@/features/__tree/model'

const BREAK_LINE = '\n'

const removeNewLine = (text: string): string => text.replaceAll(BREAK_LINE, ' ')

const insertText = ({ sourceText, newText, selection }): string =>
  `${sourceText.slice(0, selection.start)}${newText}${sourceText.slice(selection.end)}`

export default function useHandlePaste({
  nodeId,
}: {
  nodeId: string
}): ClipboardEventHandler<HTMLTextAreaElement> {
  const setTitle = useTreeStore((state) => state.setNodeTitle)

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

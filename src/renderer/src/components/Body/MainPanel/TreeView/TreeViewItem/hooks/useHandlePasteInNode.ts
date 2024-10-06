import { ClipboardEventHandler, useCallback } from 'react'
import { isHTMLTextAreaElement } from '../util'

const BREAK_LINE = '\n'

const removeNewLine = (text: string): string => text.replaceAll(BREAK_LINE, ' ')

const insertText = ({ sourceText, newText, selection }): string =>
  `${sourceText.slice(0, selection.start)}${newText}${sourceText.slice(selection.end)}`

export default function useHandlePasteInNode({
  setText
}: {
  setText: (text: string) => void
}): ClipboardEventHandler<HTMLTextAreaElement> {
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
      setText(
        insertText({
          newText,
          sourceText: value,
          selection: { start: selectionStart, end: selectionEnd }
        })
      )

      setTimeout(() => {
        const newCaretPosition = selectionStart + newText.length
        target.selectionStart = newCaretPosition
        target.selectionEnd = newCaretPosition
        target.focus()
      }, 0)
    },
    [setText]
  )
}

import { ClipboardEventHandler, useCallback } from 'react'
import { isHTMLTextAreaElement } from '../util'

const BREAK_LINE = '\n'

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
      const newText = e.clipboardData.getData('text/plain').replaceAll(BREAK_LINE, ' ')
      setText(value.slice(0, selectionStart) + newText + value.slice(selectionEnd))

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

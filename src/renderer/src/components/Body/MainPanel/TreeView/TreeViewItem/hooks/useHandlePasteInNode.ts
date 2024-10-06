import { ClipboardEventHandler, useCallback } from 'react'
import { isHTMLTextAreaElement } from '../util'

export default function useHandlePasteInNode({
  setText
}: {
  setText: (text: string) => void
}): ClipboardEventHandler<HTMLTextAreaElement> {
  return useCallback(
    (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      const { target } = e
      if (!isHTMLTextAreaElement(target)) {
        return
      }

      const { value, selectionStart, selectionEnd } = target
      const clipboardText = e.clipboardData.getData('text/plain')
      const newText = clipboardText.replaceAll('\n', ' ')

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

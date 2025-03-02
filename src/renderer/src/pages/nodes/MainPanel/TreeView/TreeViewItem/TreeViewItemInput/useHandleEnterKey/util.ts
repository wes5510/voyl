export const getSourceNodeTitle = ({
  text,
  selectionStart,
}: {
  text: string
  selectionStart?: number
}): string => (selectionStart === undefined ? text : text.slice(0, selectionStart))

export const getNewNodeTitle = ({
  text,
  selectionEnd,
}: {
  text: string
  selectionEnd?: number
}): string => (selectionEnd ? text.slice(selectionEnd) : '')

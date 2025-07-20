import { BREAK_LINE } from './const'

export const removeNewLine = (text: string): string => text.replaceAll(BREAK_LINE, ' ')

export const insertText = ({ sourceText, newText, selection }): string =>
  `${sourceText.slice(0, selection.start)}${newText}${sourceText.slice(selection.end)}`

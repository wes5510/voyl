export const isHTMLTextAreaElement = (target: EventTarget | null): target is HTMLTextAreaElement =>
  target instanceof HTMLTextAreaElement

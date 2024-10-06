import { RefObject, useEffect } from 'react'
import autosize from 'autosize'

export default function useAutoResize<T extends HTMLElement = HTMLElement>({
  ref
}: {
  ref: RefObject<T>
}): void {
  useEffect(() => {
    if (ref?.current) {
      autosize(ref.current)
    }
  }, [ref])
}

import { vstack } from '@styled-system/patterns'
import { Content as BaseContent, Portal } from '@radix-ui/react-popover'
import { PropsWithChildren } from 'react'

export default function Content({ children }: PropsWithChildren): JSX.Element {
  return (
    <Portal>
      <BaseContent
        side="bottom"
        align="start"
        alignOffset={-5}
        className={vstack({
          w: 44,
          gap: 0,
          bg: 'white',
          rounded: 'sm',
          borderWidth: '1px',
          borderColor: 'zinc.200',
          paddingY: 0.5,
          color: 'zinc.700',
          shadow: 'sm',
          outline: 'none',
          fontSize: 'sm',
          '&[data-state=open]': {
            animateIn: true,
            fadeIn: 0,
            zoomIn: 95
          },

          '&[data-state=closed]': {
            animateOut: true,
            fadeOut: 0,
            zoomOut: 95
          },

          '&[data-side=top]': {
            slideInFromBottom: '2'
          },

          '&[data-side=bottom]': {
            slideInFromTop: '2'
          },

          '&[data-side=left]': {
            slideInFromRight: '2'
          },

          '&[data-side=right]': {
            slideInFromLeft: '2'
          }
        })}
      >
        {children}
      </BaseContent>
    </Portal>
  )
}

import * as BaseTooltip from '@radix-ui/react-tooltip'
import { css } from '@styled-system/css'
import { PropsWithChildren } from 'react'

export interface TooltipProps extends PropsWithChildren {
  text: string
}

export default function Tooltip({ children, text }: TooltipProps): JSX.Element {
  return (
    <BaseTooltip.Provider skipDelayDuration={0} delayDuration={150}>
      <BaseTooltip.Root defaultOpen>
        <BaseTooltip.Trigger asChild>{children}</BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Content
            side="right"
            sideOffset={10}
            className={css({
              zIndex: 50,
              overflow: 'hidden',
              rounded: 'md',
              border: 'base',
              bg: 'zinc.700',
              px: '2.5',
              py: '1',
              textStyle: 'sm',
              color: 'white/90',
              shadow: 'md',
              animateIn: true,
              fadeIn: 0,
              zoomIn: 95,

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
            {text}
          </BaseTooltip.Content>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  )
}

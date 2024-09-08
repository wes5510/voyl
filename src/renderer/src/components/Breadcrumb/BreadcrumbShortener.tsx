import * as Popover from '@radix-ui/react-popover'
import { hstack, vstack } from '@styled-system/patterns'
import BreadcrumbLink from './BreadcrumbLink'
import { Item } from './types'
import BreadcrumbShortenerItem from './BreadcrumbShortenerItem'

export interface BreadcrumbShortenerProps {
  items: Item[]
}

export default function BreadcrumbShortener({ items }: BreadcrumbShortenerProps): JSX.Element {
  return (
    <div className={hstack({ gap: 2 })}>
      <span>/</span>
      <Popover.Root>
        <Popover.Trigger asChild>
          <BreadcrumbLink text="..." />
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
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
            {items.map((item) => (
              <BreadcrumbShortenerItem key={item.href} {...item} />
            ))}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}

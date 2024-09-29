import { css } from '@styled-system/css'
import { PropsWithChildren } from 'react'

export default function Scroller({ children }: PropsWithChildren): JSX.Element {
  return (
    <div
      className={css({
        position: 'relative',
        h: 'full',
        w: 'full'
      })}
    >
      <div
        className={css({
          position: 'absolute',
          top: 0,
          left: 0,
          w: 'full',
          h: 'full',
          overflowY: 'auto'
        })}
      >
        {children}
      </div>
    </div>
  )
}

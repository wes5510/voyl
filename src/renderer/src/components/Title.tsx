import { css } from '@styled-system/css'
import { hstack } from '@styled-system/patterns'
import { ElementType } from 'react'

export interface TitleProps {
  text: string
  icon?: ElementType
}

export default function Title({ icon: Icon, text }: TitleProps): JSX.Element {
  return (
    <div
      className={hstack({
        gap: 3
      })}
    >
      {Icon && (
        <Icon
          className={css({
            width: 9,
            height: 9
          })}
        />
      )}
      <span
        className={css({
          fontSize: '3xl',
          fontWeight: 'bold',
          fontFamily: 'roboto mono, monospace'
        })}
      >
        {text}
      </span>
    </div>
  )
}

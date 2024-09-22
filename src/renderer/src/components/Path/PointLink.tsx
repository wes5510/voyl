import { ReactNode } from 'react'
import { hstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'

interface PointLinkProps {
  text: string
  icon?: ReactNode
  href?: string
}

export default function PointLink({ text, icon, href }: PointLinkProps): JSX.Element {
  return (
    <div className={hstack({ gap: 2 })}>
      <span>/</span>
      <a
        href={href}
        className={hstack({
          gap: 1,
          cursor: 'pointer',
          _hover: {
            textDecoration: 'underline'
          }
        })}
      >
        {icon}
        <span
          className={css({
            truncate: true,
            maxW: 48
          })}
        >
          {text}
        </span>
      </a>
    </div>
  )
}

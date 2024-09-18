import { ReactNode } from 'react'
import { hstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'

interface LinkProps {
  text: string
  icon?: ReactNode
  href?: string
}

export default function Link({ icon, text, href }: LinkProps): JSX.Element {
  return (
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
  )
}

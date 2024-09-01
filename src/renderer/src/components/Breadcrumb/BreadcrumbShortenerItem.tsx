import { ReactNode } from 'react'
import { hstack } from '../../../../../styled-system/patterns/index.mjs'
import { css } from '../../../../../styled-system/css/index.mjs'

interface BreadcrumbShortenerItemProps {
  href: string
  text: string
  icon?: ReactNode
}

export default function BreadcrumbShortenerItem({
  href,
  text,
  icon
}: BreadcrumbShortenerItemProps): JSX.Element {
  return (
    <a
      className={hstack({
        gap: 1,
        w: 'full',
        paddingX: 3,
        paddingY: 1,
        cursor: 'pointer',
        _hover: {
          bg: 'zinc.100'
        }
      })}
      href={href}
    >
      {icon}
      <span
        className={css({
          truncate: true,
          flex: 1
        })}
      >
        {text}
      </span>
    </a>
  )
}

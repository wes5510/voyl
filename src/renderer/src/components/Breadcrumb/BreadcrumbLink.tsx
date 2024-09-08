import { forwardRef, ReactNode } from 'react'
import { hstack } from '@styled-system/patterns'
import { css } from '@styled-system/css'

interface BreadcrumbLinkProps {
  text: string
  icon?: ReactNode
  href?: string
}

const BreadcrumbLink = forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(function BreadcrumbLink(
  { text, href, icon, ...props },
  ref
) {
  return (
    <a
      {...props}
      ref={ref}
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
})

export default BreadcrumbLink

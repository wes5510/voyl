import { Root } from '@radix-ui/react-popover'
import { PropsWithChildren } from 'react'

export default function Popover({ children }: PropsWithChildren): JSX.Element {
  return <Root>{children}</Root>
}

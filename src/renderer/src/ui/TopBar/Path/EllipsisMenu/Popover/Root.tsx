import { Root as BaseRoot } from '@radix-ui/react-popover'
import { PropsWithChildren } from 'react'

export default function Root({ children }: PropsWithChildren): JSX.Element {
  return <BaseRoot>{children}</BaseRoot>
}

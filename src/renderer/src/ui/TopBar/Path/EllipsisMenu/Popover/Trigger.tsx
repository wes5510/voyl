import { Trigger as BaseTrigger } from '@radix-ui/react-popover'
import { PropsWithChildren } from 'react'

export default function Trigger({ children }: PropsWithChildren): JSX.Element {
  return (
    <BaseTrigger asChild>
      <span>{children}</span>
    </BaseTrigger>
  )
}

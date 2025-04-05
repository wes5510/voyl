import Content from './Content'
import Provider from './Provider'
import Root from './Root'
import Trigger from './Trigger'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: React.ComponentProps<typeof Content>['side']
}

export default function Tooltip({ content, children, side }: TooltipProps) {
  return (
    <Provider>
      <Root>
        <Trigger>{children}</Trigger>
        <Content side={side}>{content}</Content>
      </Root>
    </Provider>
  )
}

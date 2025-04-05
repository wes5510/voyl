import Provider from './Provider'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Root({ ...props }: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <Provider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </Provider>
  )
}

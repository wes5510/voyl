import * as TooltipPrimitive from '@radix-ui/react-tooltip'

export default function Trigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

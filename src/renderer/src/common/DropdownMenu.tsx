import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

export default function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

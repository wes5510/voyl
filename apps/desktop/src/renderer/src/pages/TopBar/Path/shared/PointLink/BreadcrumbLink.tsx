import { Slot } from '@radix-ui/react-slot'
import cn from '@/common/shared/cn'

export default function BreadcrumbLink({
  asChild,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn('transition-colors hover:underline', className)}
      {...props}
    />
  )
}

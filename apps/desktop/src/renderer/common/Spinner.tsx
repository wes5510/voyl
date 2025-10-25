import { Loader2 } from 'lucide-react'
import cn from './shared/cn'

interface SpinnerProps {
  className?: string
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className={cn('h-10 w-10 animate-spin', className)} />
    </div>
  )
}

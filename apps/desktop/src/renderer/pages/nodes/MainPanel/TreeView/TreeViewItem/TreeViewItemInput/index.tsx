import { useRef } from 'react'
import { useTreeNodeTitle } from '@/renderer/store/tree'
import useAutoResize from './useAutoResize'
import cn from '@/renderer/common/shared/cn'

export interface TreeViewItemInputProps {
  nodeId: string
  className?: string
}

export default function TreeViewItemInput({ nodeId, className }: TreeViewItemInputProps) {
  const elemRef = useRef<HTMLTextAreaElement>(null)
  const title = useTreeNodeTitle({ nodeId })

  useAutoResize({ ref: elemRef })

  return (
    <textarea
      ref={elemRef}
      value={title}
      rows={1}
      className={cn('word-break-break-word resize-none outline-none', className)}
    />
  )
}

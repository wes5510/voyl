import { useState } from 'react'
import { useTreeNodeDetailed, usePrefetchTreeNodes } from '@/renderer/store/tree'
import IconButton from './IconButton'
import CollapseIcon from '../shared/CollapseIcon'

export interface ExpandButtonProps {
  nodeId: string
}

export default function ExpandButton({ nodeId }: ExpandButtonProps) {
  const [expanded, setExpanded] = useState(false)
  const node = useTreeNodeDetailed({ nodeId })
  const prefetchTreeNodes = usePrefetchTreeNodes()

  const hasChildren = node?.childIds && node.childIds.length > 0

  const handleClick = (): void => {
    if (!hasChildren) return

    const newExpanded = !expanded
    setExpanded(newExpanded)

    // 확장 시 자식 노드들 prefetch
    if (newExpanded && node?.childIds) {
      prefetchTreeNodes(node.childIds)
    }
  }

  // 자식이 없으면 빈 공간 표시
  if (!hasChildren) {
    return <div className="h-6 w-6" />
  }

  return (
    <IconButton onClick={handleClick}>
      <CollapseIcon expanded={expanded} />
    </IconButton>
  )
}

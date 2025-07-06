import CollapseButton from './ExpandButton'
import DotButton from './DotButton'
import TreeViewItemInput from './TreeViewItemInput'
import TreeViewItemWrapper from '../shared/TreeViewItemWrapper'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { memo } from 'react'

const MTreeViewItemInput = memo(TreeViewItemInput)
const MCollapseButton = memo(CollapseButton)

export interface TreeViewItemProps {
  nodeId: string
  depth: number
}

export default function TreeViewItem({ nodeId, depth }: TreeViewItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: nodeId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <TreeViewItemWrapper ref={setNodeRef} depth={depth} style={style}>
      <MCollapseButton nodeId={nodeId} />
      <DotButton {...attributes} {...listeners} />
      <MTreeViewItemInput nodeId={nodeId} className="flex-1" />
    </TreeViewItemWrapper>
  )
}

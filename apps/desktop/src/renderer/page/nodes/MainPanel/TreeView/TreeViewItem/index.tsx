import ExpandButton from './ExpandButton'
import DotButton from './DotButton'
import TreeViewItemInput from './TreeViewItemInput'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Wrapper from '../shared/Wrapper'

export interface TreeViewItemProps {
  nodeId: string
  depth: number
}

export default function TreeViewItem({ nodeId, depth }: TreeViewItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: nodeId,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <Wrapper ref={setNodeRef} depth={depth} style={style}>
      <ExpandButton />
      <DotButton {...attributes} {...listeners} />
      <TreeViewItemInput nodeId={nodeId} className="flex-1" />
    </Wrapper>
  )
}

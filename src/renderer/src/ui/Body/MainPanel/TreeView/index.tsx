import { vstack } from '@/styled-system/patterns'
import { useAtomValue, useSetAtom } from 'jotai'
import TreeViewItem from './TreeViewItem'
import { memo } from 'react'
import AddButton from './AddButton'
import { moveNodeAtom, nodeIdsAtom, setCollapsedNodeByNodeIdAtom } from '@/state/tree.state'
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { INDENT_WIDTH } from './const'

const MTreeViewItem = memo(TreeViewItem)

export default function TreeView(): JSX.Element {
  const nodeIds = useAtomValue(nodeIdsAtom)
  const moveNode = useSetAtom(moveNodeAtom)
  const setCollapsedNodeByNodeId = useSetAtom(setCollapsedNodeByNodeIdAtom)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ over, active, delta }: DragEndEvent): void => {
    if (typeof over?.id !== 'string' || typeof active?.id !== 'string') {
      return
    }

    moveNode({
      refNodeId: over.id,
      targetNodeId: active.id,
      deltaDepth: Math.round(delta.x / INDENT_WIDTH),
    })
  }

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (typeof active.id !== 'string') {
      return
    }

    setCollapsedNodeByNodeId({ nodeId: active.id, collapsed: true })
  }

  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
      >
        <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
          {nodeIds.map((id) => (
            <MTreeViewItem key={id} nodeId={id} />
          ))}
        </SortableContext>
      </DndContext>
      <AddButton />
    </div>
  )
}

import { vstack } from '@/styled-system/patterns'
import TreeViewItem from './TreeViewItem'
import { memo } from 'react'
import AddButton from './AddButton'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverlay,
  DragMoveEvent,
  MeasuringStrategy,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import useTreeViewStore, { getDraggingNode, getTreeViewNodes } from '@/models/treeView/store'
import DraggingTreeviewItem from './DraggingTreeviewItem'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}
const MTreeViewItem = memo(TreeViewItem)

export default function TreeView(): JSX.Element {
  const { treeViewNodes, draggingNode } = useTreeViewStore((state) => ({
    treeViewNodes: getTreeViewNodes(state),
    draggingNode: getDraggingNode(state),
  }))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (): void => {}

  const handleDragMove = ({ over }: DragMoveEvent): void => {
    if (typeof over?.id !== 'string') {
      return
    }
  }

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (typeof active.id !== 'string') {
      return
    }
  }

  const handleDragCancel = (): void => {}

  return (
    <div className={vstack({ gap: 3, alignItems: 'normal' })}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        measuring={measuring}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        onDragCancel={handleDragCancel}
        onDragMove={handleDragMove}
      >
        <SortableContext
          items={treeViewNodes.map((node) => node.id)}
          strategy={verticalListSortingStrategy}
        >
          {treeViewNodes.map((node) => (
            <MTreeViewItem key={node.id} nodeId={node.id} depth={node.depth} />
          ))}
          {createPortal(
            <DragOverlay>
              {draggingNode && (
                <DraggingTreeviewItem title={draggingNode.title} depth={draggingNode.depth} />
              )}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
      <AddButton />
    </div>
  )
}

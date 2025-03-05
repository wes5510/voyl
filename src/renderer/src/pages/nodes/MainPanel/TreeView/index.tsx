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
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import useTreeViewStore, { getDraggingNode, getTreeViewNodes } from '@/models/treeView/store'
import DraggingTreeviewItem from './DraggingTreeviewItem'
import { INDENT_WIDTH } from './shared/const'
import useTreeStore from '@/models/tree/store'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}
const MTreeViewItem = memo(TreeViewItem)

export default function TreeView() {
  const {
    treeViewNodes,
    draggingNode,
    setDraggingNode,
    resetDraggingNode,
    moveDraggingNode,
    getDraggingNodeParentId,
    getCountChildBetweenNodes,
  } = useTreeViewStore((state) => ({
    treeViewNodes: getTreeViewNodes(state),
    draggingNode: getDraggingNode({ entity: state.entity }),
    setDraggingNode: state.setDraggingNode,
    resetDraggingNode: state.resetDraggingNode,
    moveDraggingNode: state.moveDraggingNode,
    getDraggingNodeParentId: state.getDraggingNodeParentId,
    getCountChildBetweenNodes: state.getCountChildBetweenNodes,
  }))
  const { moveToChildNode, nodeTable } = useTreeStore((state) => ({
    moveToChildNode: state.moveToChildNode,
    nodeTable: state.entity.nodeTable,
  }))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = ({ over }: DragEndEvent): void => {
    if (!draggingNode || typeof over?.id !== 'string') {
      return
    }

    const parentNodeId = getDraggingNodeParentId({ overNodeId: over.id })
    if (!parentNodeId) {
      return
    }

    const childNodeIndex = getCountChildBetweenNodes({ parentNodeId, nodeId: over.id })

    moveToChildNode({
      parentNodeId,
      newNodeId: draggingNode.id,
      index: childNodeIndex,
    })

    resetDraggingNode({ nodeTable })
  }

  const handleDragMove = ({ delta, over }: DragMoveEvent): void => {
    if (typeof over?.id !== 'string' || !draggingNode) {
      return
    }

    moveDraggingNode({
      overNodeId: over.id,
      deltaDepth: Math.round(delta.x / INDENT_WIDTH),
    })
  }

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (typeof active.id !== 'string') {
      return
    }

    setDraggingNode({
      nodeId: active.id,
      nodeTable,
    })
  }

  const handleDragCancel = (): void => {
    resetDraggingNode()
  }

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
            <MTreeViewItem
              key={node.id}
              nodeId={node.id}
              depth={draggingNode?.id === node.id ? draggingNode.depth : node.depth}
            />
          ))}
          {createPortal(
            <DragOverlay>
              {draggingNode && <DraggingTreeviewItem nodeId={draggingNode.id} />}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
      <AddButton />
    </div>
  )
}

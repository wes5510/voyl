import { vstack } from '@/styled-system/patterns'
import { useAtom, useSetAtom } from 'jotai'
import { useAtomCallback } from 'jotai/utils'
import TreeViewItem from './TreeViewItem'
import { memo, useState, useCallback } from 'react'
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
import { INDENT_WIDTH } from './shared/const'
import { createPortal } from 'react-dom'
import DraggingTreeviewItem from './DraggingTreeviewItem'
import { nodeAtom } from '@/features/tree/model/node'
import { moveNodeAtom, nodeIdsAtom } from '@/features/tree/model/tree'
import { NodeModel } from '@/features/tree/model/node/node.model'

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
}
const MTreeViewItem = memo(TreeViewItem)

export default function TreeView(): JSX.Element {
  const [nodeIds, setNodeIds] = useAtom(nodeIdsAtom)
  const moveNode = useSetAtom(moveNodeAtom)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )
  const [draggingNode, setDraggingNode] = useState<NodeModel | undefined>(undefined)
  const [originNodeIds, setOriginNodeIds] = useState<string[]>([])
  const readDraggingNode = useAtomCallback(
    useCallback((get, _set, { nodeId }: { nodeId: string }) => {
      return nodeId ? get(nodeAtom({ id: nodeId })) : undefined
    }, []),
  )
  const writeDraggingNode = useAtomCallback(
    useCallback((_get, set, { node }: { node: NodeModel }) => {
      if (!node) {
        return
      }

      set(nodeAtom({ id: node.id }), node)
    }, []),
  )

  const handleDragEnd = (): void => {
    setDraggingNode(undefined)
    setOriginNodeIds([])
  }

  const handleDragMove = ({ over, delta }: DragMoveEvent): void => {
    if (typeof over?.id !== 'string' || !draggingNode) {
      return
    }

    moveNode({
      refNodeId: over.id,
      targetNode: draggingNode,
      deltaDepth: Math.round(delta.x / INDENT_WIDTH),
    })
  }

  const handleDragStart = ({ active }: DragStartEvent): void => {
    if (typeof active.id !== 'string') {
      return
    }

    setDraggingNode(JSON.parse(JSON.stringify(readDraggingNode({ nodeId: active.id }))))
    setOriginNodeIds(JSON.parse(JSON.stringify(nodeIds)))
  }

  const handleDragCancel = (): void => {
    if (draggingNode) {
      writeDraggingNode({ node: draggingNode })
    }

    setNodeIds(originNodeIds)
    setDraggingNode(undefined)
    setOriginNodeIds([])
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
        <SortableContext items={nodeIds} strategy={verticalListSortingStrategy}>
          {nodeIds.map((id) => (
            <MTreeViewItem key={id} nodeId={id} />
          ))}
          {createPortal(
            <DragOverlay>
              {draggingNode && (
                <DraggingTreeviewItem
                  depth={draggingNode.depth}
                  title={draggingNode.title}
                  collapsed={draggingNode.collapsed}
                />
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

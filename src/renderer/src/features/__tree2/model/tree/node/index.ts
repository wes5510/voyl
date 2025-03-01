import { v4 as uuidv4 } from 'uuid'
import { createNewTask, TaskEntity } from './task'
import { generateMidKey } from './stringIndexing'

export interface NodeEntity {
  id: string
  parentId?: string
  index?: string
  childrenNodeMap: Map<NodeEntity['id'], NodeEntity>
  __orderedChildren: NodeEntity[]
  // depth: number
  collapsed: boolean
  task: TaskEntity
}

export const createNewNode = ({
  task = {
    title: '',
    done: false,
  },
}: {
  task?: {
    title?: string
    done?: boolean
  }
}): NodeEntity => {
  return {
    id: uuidv4(),
    childrenNodeMap: new Map(),
    __orderedChildren: [],
    collapsed: false,
    task: createNewTask(task),
  }
}

export const insertChildrenNodeAfter = ({
  entity,
  refNode,
  newNode,
}: {
  entity: NodeEntity
  refNode: NodeEntity
  newNode: NodeEntity
}): NodeEntity => {
  const nextNode = __getNextChildrenNode({
    entity,
    nodeId: refNode.id,
  })

  newNode.parentId = refNode.parentId
  newNode.index = generateMidKey({ prev: refNode.index, next: nextNode?.index })

  return __addNewNode({ entity, newNode })

  /*
  - A 노드의 parent node id, index 가져오기
  - 새로운 노드의 index 생성
  - parent node id와 index로 새로운 노드 생성
    - 새로운 Task 생성
  */
}

const __getNextChildrenNode = ({ entity, nodeId }: { entity: NodeEntity; nodeId: string }) => {
  const childrenNodes = getOrderedChildren({ entity })
  const refIndex = childrenNodes.findIndex((n) => n.id === nodeId)
  return childrenNodes[refIndex + 1]
}

const getOrderedChildren = ({ entity }: { entity: NodeEntity }) => {
  if (entity.__orderedChildren.length === 0) {
    entity.__orderedChildren = Array.from(entity.childrenNodeMap.values()).sort((a, b) =>
      a.index.localeCompare(b.index),
    )
  }

  return entity.__orderedChildren
}

const __addNewNode = ({ entity, newNode }: { entity: NodeEntity; newNode: NodeEntity }) => {
  entity.childrenNodeMap.set(newNode.id, newNode)

  entity.__orderedChildren.push(newNode)

  return entity
}

import { createNewNode, insertChildrenNodeAfter, NodeEntity } from './node'

/*
Tree 와 Node 의 역할이 모호해짐
- Tree에 Node를 삽입한다면 어디서 삽입을 해야되는가?
*/

export interface TreeEntity {
  nodeMap: Map<NodeEntity['id'], NodeEntity>
}

export const insertNewNodeAfter = ({
  entity,
  refNodeId,
  newNodeTitle,
}: {
  entity: TreeEntity
  refNodeId: string
  newNodeTitle: string
}): TreeEntity => {
  const refNode = entity.nodeMap.get(refNodeId)

  if (!refNode) {
    throw new Error('refNode not found')
  }

  return refNode.collapsed
    ? // A 노드의 다음 형제 노드로 새로운 노드 추가
      insertSiblingNodeAfter({ entity, refNode, newNodeTitle })
    : // A 노드의 첫번째 자식으로 새로운 노드 추가
      prependChildNodeTo({ entity, refNode, newNodeTitle })
}

const insertSiblingNodeAfter = ({
  entity,
  refNode,
  newNodeTitle,
}: {
  entity: TreeEntity
  refNode: NodeEntity
  newNodeTitle: string
}): TreeEntity => {
  if (!refNode.parentId) {
    throw new Error('refNode has no parentId')
  }

  const parentNode = entity.nodeMap.get(refNode.parentId)

  if (!parentNode) {
    throw new Error('parentNode not found')
  }

  const newParentNode = insertChildrenNodeAfter({
    entity: parentNode,
    refNode,
    newNode: createNewNode({
      task: {
        title: newNodeTitle,
      },
    }),
  })

  return __updateNode({ entity, newNode: newParentNode })
}

const prependChildNodeTo = ({
  entity,
  refNode,
  newNodeTitle,
}: {
  entity: TreeEntity
  refNode: NodeEntity
  newNodeTitle: string
}): TreeEntity => {
  /*
  - A노드 id 가져오기
  - 새로운 노드의 index 생성
  - parent node id 와 index로 새로운 노드 생성
    - 새로운 Task 생성
  */
}

const __addNewNode = ({
  entity,
  newNode,
}: {
  entity: TreeEntity
  newNode: NodeEntity
}): TreeEntity => {
  return {
    nodeMap: new Map(entity.nodeMap).set(newNode.id, newNode),
  }
}

const __updateNode = ({
  entity,
  newNode,
}: {
  entity: TreeEntity
  newNode: NodeEntity
}): TreeEntity => {
  return {
    nodeMap: new Map(entity.nodeMap).set(newNode.id, newNode),
  }
}

export const removeNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: string
}): TreeEntity => {
  const __new = new Map(entity.nodeMap)

  __new.delete(nodeId)

  return {
    nodeMap: __new,
  }
}

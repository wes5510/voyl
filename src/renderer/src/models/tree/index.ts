import {
  createNewNode,
  getChildNodeIds,
  getTaskTitle,
  NodeEntity,
  setTaskTitle,
  removeChildNodeId,
  NodeEntityId,
  insertChildNodeId,
  setParentNodeId,
  getChildNodeIndex,
  getPrevSiblingChildNodeId,
  getLastChildNodeIndex,
} from './node'
import { getNode, isExistNode, NodeTableEntity, removeNodes, setNode } from './nodeTable'

export interface TreeEntity {
  rootNodeId: NodeEntityId
  nodeTable: NodeTableEntity
}

export const getChildNodeIdsByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}): NodeEntityId[] => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? getChildNodeIds({ entity: node }) : []
}

export const getTitleByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}): NodeEntity['task']['title'] => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? getTaskTitle({ entity: node }) : ''
}

export const insertNewNodeAfter = ({
  entity,
  sourceNode,
  newNodeTitle,
  nested,
}: {
  entity: TreeEntity
  sourceNode: {
    id: NodeEntityId
    title: string
  }
  newNodeTitle: NodeEntity['task']['title']
  nested: boolean
}): { entity: TreeEntity; newNode: NodeEntity } => {
  if (!isExistNode({ entity: entity.nodeTable, nodeId: sourceNode.id })) {
    throw new Error('Source node not found')
  }

  const { entity: newEntity, newNodeId } = __createNewNode({
    entity: setTitleByNodeId({ entity, nodeId: sourceNode.id, title: sourceNode.title }),
    title: newNodeTitle,
  })

  const __newEntity = nested
    ? __prependChildNode({
        entity: newEntity,
        sourceNodeId: sourceNode.id,
        newNodeId,
      })
    : __appendSiblingNode({
        entity: newEntity,
        sourceNodeId: sourceNode.id,
        newNodeId,
      })

  const newNode = getNode({ entity: __newEntity.nodeTable, nodeId: newNodeId })

  if (!newNode) {
    throw new Error('New node not found')
  }

  return {
    entity: __newEntity,
    newNode,
  }
}

export const setTitleByNodeId = ({
  entity,
  nodeId,
  title,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
  title: NodeEntity['task']['title']
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  return node
    ? {
        ...entity,
        nodeTable: setNode({
          entity: entity.nodeTable,
          node: setTaskTitle({ entity: node, title }),
        }),
      }
    : entity
}

const __createNewNode = ({
  entity,
  title,
}: {
  entity: TreeEntity
  title: string
}): { entity: TreeEntity; newNodeId: NodeEntityId } => {
  const newNode = createNewNode({ title })

  return {
    entity: {
      ...entity,
      nodeTable: setNode({ entity: entity.nodeTable, node: newNode }),
    },
    newNodeId: newNode.id,
  }
}

const __prependChildNode = ({
  entity,
  sourceNodeId,
  newNodeId,
}: {
  entity: TreeEntity
  sourceNodeId: NodeEntityId
  newNodeId: NodeEntityId
}): TreeEntity => {
  return __moveToChildNode({
    entity,
    parentNodeId: sourceNodeId,
    newNodeId,
    index: 0,
  })
}

const __appendSiblingNode = ({
  entity,
  sourceNodeId,
  newNodeId,
}: {
  entity: TreeEntity
  sourceNodeId: string
  newNodeId: string
}): TreeEntity => {
  const parentNodeId = __getParentNodeIdByNodeId({ entity, nodeId: sourceNodeId })

  if (!parentNodeId) {
    return entity
  }

  return __moveToChildNode({
    entity,
    parentNodeId,
    newNodeId,
    index:
      __getChildNodeIndex({
        entity,
        parentNodeId,
        childNodeId: sourceNodeId,
      }) + 1,
  })
}

const __getChildNodeIndex = ({
  entity,
  parentNodeId,
  childNodeId,
}: {
  entity: TreeEntity
  parentNodeId: string
  childNodeId: string
}): number => {
  const parentNode = getNode({ entity: entity.nodeTable, nodeId: parentNodeId })

  if (!parentNode) {
    throw new Error('Parent node not found')
  }

  return getChildNodeIndex({ entity: parentNode, childNodeId })
}

const __moveToChildNode = ({
  entity,
  parentNodeId,
  newNodeId,
  index,
}: {
  entity: TreeEntity
  parentNodeId: string
  newNodeId: string
  index: number
}): TreeEntity => {
  let __newEntity = __removeChildNodeIdFromParentNode({ entity, nodeId: newNodeId })
  __newEntity = __insertChildNodeId({ entity: __newEntity, parentNodeId, newNodeId, index })
  __newEntity = __setParentNodeId({
    entity: __newEntity,
    nodeId: newNodeId,
    parentNodeId,
  })

  return __newEntity
}

const __insertChildNodeId = ({
  entity,
  parentNodeId,
  newNodeId,
  index,
}: {
  entity: TreeEntity
  parentNodeId: string
  newNodeId: string
  index: number
}): TreeEntity => {
  const parentNode = getNode({ entity: entity.nodeTable, nodeId: parentNodeId })

  if (!parentNode) {
    return entity
  }

  return {
    ...entity,
    nodeTable: setNode({
      entity: entity.nodeTable,
      node: insertChildNodeId({ entity: parentNode, newNodeId, index }),
    }),
  }
}

const __removeChildNodeIdFromParentNode = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  if (!node) {
    return entity
  }

  const parentNode = __getParentNode({ entity, node })

  if (!parentNode) {
    return entity
  }

  return {
    ...entity,
    nodeTable: setNode({
      entity: entity.nodeTable,
      node: removeChildNodeId({ entity: parentNode, nodeId: node.id }),
    }),
  }
}

const __setParentNodeId = ({
  entity,
  nodeId,
  parentNodeId,
}: {
  entity: TreeEntity
  nodeId: string
  parentNodeId: string
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  if (!node) {
    return entity
  }

  return {
    ...entity,
    nodeTable: setNode({
      entity: entity.nodeTable,
      node: setParentNodeId({
        entity: node,
        parentNodeId,
      }),
    }),
  }
}

export const getNodeTable = (entity: TreeEntity): NodeTableEntity => {
  return entity.nodeTable
}

export const removeNodeByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}): TreeEntity => {
  if (nodeId === entity.rootNodeId) {
    throw new Error('Root node cannot be removed')
  }

  const node = getNode({ entity: entity.nodeTable, nodeId })

  if (!node) {
    return entity
  }

  return {
    ...entity,
    nodeTable: __removeNodeWithChildNodes({
      entity: __removeNodeFromParentNode({ entity, node }),
      node,
    }),
  }
}

const __removeNodeFromParentNode = ({
  entity,
  node,
}: {
  entity: TreeEntity
  node: NodeEntity
}): TreeEntity => {
  const parentNode = __getParentNode({ entity, node })
  if (!parentNode) {
    return entity
  }

  return {
    ...entity,
    nodeTable: setNode({
      entity: entity.nodeTable,
      node: removeChildNodeId({ entity: parentNode, nodeId: node.id }),
    }),
  }
}

const __getParentNodeIdByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}) => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  if (!node) {
    return undefined
  }

  return __getParentNode({
    entity,
    node,
  })?.id
}

const __getParentNode = ({ entity, node }: { entity: TreeEntity; node: NodeEntity }) => {
  return node.parentNodeId
    ? getNode({ entity: entity.nodeTable, nodeId: node.parentNodeId })
    : undefined
}

const __removeNodeWithChildNodes = ({ entity, node }: { entity: TreeEntity; node: NodeEntity }) => {
  return removeNodes({
    entity: entity.nodeTable,
    nodeIds: [...__getNestedChildNodeIds({ entity, node }), node.id],
  })
}

const __getNestedChildNodeIds = ({
  entity,
  node,
}: {
  entity: TreeEntity
  node: NodeEntity
}): NodeEntityId[] => {
  const nestedChildNodeIds: NodeEntityId[] = []
  const stack: NodeEntity[] = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode !== node) {
      nestedChildNodeIds.push(currentNode.id)
    }

    const childNodeIds = getChildNodeIds({ entity: currentNode })
    for (const childNodeId of childNodeIds) {
      const childNode = getNode({ entity: entity.nodeTable, nodeId: childNodeId })
      if (childNode) {
        stack.push(childNode)
      }
    }
  }

  return nestedChildNodeIds
}

export const outdentNode = ({ entity, nodeId }: { entity: TreeEntity; nodeId: NodeEntityId }) => {
  return __moveToParentNextSibling({
    entity,
    nodeId: nodeId,
  })
}

const __moveToParentNextSibling = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}) => {
  const parentNodeId = __getParentNodeIdByNodeId({ entity, nodeId })

  if (!parentNodeId) {
    return entity
  }

  const grandParentNodeId = __getParentNodeIdByNodeId({ entity, nodeId: parentNodeId })

  if (!grandParentNodeId) {
    return entity
  }

  return __moveToChildNode({
    entity,
    parentNodeId: grandParentNodeId,
    newNodeId: nodeId,
    index:
      __getChildNodeIndex({
        entity,
        parentNodeId: grandParentNodeId,
        childNodeId: parentNodeId,
      }) + 1,
  })
}

export const indentNode = ({ entity, nodeId }: { entity: TreeEntity; nodeId: NodeEntityId }) => {
  return __moveToPrevSiblingAsChild({
    entity,
    nodeId,
  })
}

const __moveToPrevSiblingAsChild = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}) => {
  const prevSiblingNodeId = __getPrevSiblingNodeId({ entity, nodeId })

  if (!prevSiblingNodeId) {
    return entity
  }

  return __moveToChildNode({
    entity,
    parentNodeId: prevSiblingNodeId,
    newNodeId: nodeId,
    index:
      __getLastChildNodeIndex({
        entity,
        parentNodeId: prevSiblingNodeId,
      }) + 1,
  })
}

const __getPrevSiblingNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntityId
}) => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  if (!node) {
    return undefined
  }

  const parentNode = __getParentNode({
    entity,
    node,
  })

  return parentNode
    ? getPrevSiblingChildNodeId({
        entity: parentNode,
        childNodeId: nodeId,
      })
    : undefined
}

const __getLastChildNodeIndex = ({
  entity,
  parentNodeId,
}: {
  entity: TreeEntity
  parentNodeId: NodeEntityId
}): number => {
  const parentNode = getNode({ entity: entity.nodeTable, nodeId: parentNodeId })

  if (!parentNode) {
    throw new Error('Parent node not found')
  }

  return getLastChildNodeIndex({ entity: parentNode })
}

export const getRootNodeId = (entity: TreeEntity): NodeEntityId => {
  return entity.rootNodeId
}

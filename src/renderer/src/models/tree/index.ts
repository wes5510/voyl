import {
  createNewNode,
  getTaskTitle,
  NodeEntity,
  prependChildNodeId,
  setNextSiblingNodeId,
  setNodeProps,
  setPrevSiblingNodeId,
  setTaskTitle,
  toggleCollapsed,
} from './node'
import { getNode, NodeTableEntity, setNode, setNodes } from './nodeTable'

export interface TreeEntity {
  nodeTable: NodeTableEntity
}

export const toggleCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): TreeEntity => {
  const node = getNode({ entity: entity.nodeTable, nodeId })

  return node
    ? {
        ...entity,
        nodeTable: setNode({
          entity: entity.nodeTable,
          node: toggleCollapsed({ entity: node }),
        }),
      }
    : entity
}

export const getCollapsedByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): boolean => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? node.collapsed : false
}

export const setTitleByNodeId = ({
  entity,
  nodeId,
  title,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
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

export const getTitleByNodeId = ({
  entity,
  nodeId,
}: {
  entity: TreeEntity
  nodeId: NodeEntity['id']
}): NodeEntity['task']['title'] => {
  const node = getNode({ entity: entity.nodeTable, nodeId })
  return node ? getTaskTitle({ entity: node }) : ''
}

export const insertNewNodeAfter = ({
  entity,
  sourceNode,
  newNodeTitle,
}: {
  entity: TreeEntity
  sourceNode: {
    id: NodeEntity['id']
    title: NodeEntity['task']['title']
  }
  newNodeTitle: NodeEntity['task']['title']
}): { entity: TreeEntity; newNode?: NodeEntity } => {
  const srcNode = getNode({ entity: entity.nodeTable, nodeId: sourceNode.id })

  if (!srcNode) {
    throw new Error('Source node not found')
  }

  const newNode = createNewNode({ title: newNodeTitle })
  const __srcNode = setTaskTitle({ entity: srcNode, title: sourceNode.title })

  const newEntity = srcNode.collapsed
    ? __appendSiblingNode({ entity, sourceNode: __srcNode, newNode })
    : __prependChildNode({ entity, sourceNode: __srcNode, newNode })

  return {
    entity: newEntity,
    newNode: getNode({ entity: newEntity.nodeTable, nodeId: newNode.id }),
  }
}

export const getNodeTable = (entity: TreeEntity): NodeTableEntity => {
  return entity.nodeTable
}

const __prependChildNode = ({
  entity,
  sourceNode,
  newNode,
}: {
  entity: TreeEntity
  sourceNode: NodeEntity
  newNode: NodeEntity
}): TreeEntity => {
  const sourceNodeFirstChildNode = __setPrevSiblingNodeIdOfFirstChildNode({
    entity,
    sourceNode,
    newNodeId: newNode.id,
  })

  const __newNode = setNodeProps({
    entity: newNode,
    props: {
      parentNodeId: sourceNode.id,
      nextSiblingNodeId: sourceNodeFirstChildNode?.id,
    },
  })

  const __sourceNode = prependChildNodeId({
    entity: sourceNode,
    newNodeId: __newNode.id,
  })

  return {
    ...entity,
    nodeTable: setNodes({
      entity: entity.nodeTable,
      nodes: [__sourceNode, __newNode, sourceNodeFirstChildNode].filter(
        (node) => node !== undefined,
      ),
    }),
  }
}

const __setPrevSiblingNodeIdOfFirstChildNode = ({
  entity,
  sourceNode,
  newNodeId,
}: {
  entity: TreeEntity
  sourceNode: NodeEntity
  newNodeId: NodeEntity['id']
}) => {
  let sourceNodeFirstChildNode: NodeEntity | undefined = undefined

  if (sourceNode.childNodeIds[0]) {
    sourceNodeFirstChildNode = getNode({
      entity: entity.nodeTable,
      nodeId: sourceNode.childNodeIds[0],
    })

    if (sourceNodeFirstChildNode) {
      sourceNodeFirstChildNode = setPrevSiblingNodeId({
        entity: sourceNodeFirstChildNode,
        nodeId: newNodeId,
      })
    }
  }

  return sourceNodeFirstChildNode
}

const __appendSiblingNode = ({
  entity,
  sourceNode,
  newNode,
}: {
  entity: TreeEntity
  sourceNode: NodeEntity
  newNode: NodeEntity
}): TreeEntity => {
  const nextSiblingNode = __setPrevSiblingNodeIdOfNextSiblingNode({
    entity,
    sourceNode,
    newNodeId: newNode.id,
  })

  const __newNode = setNodeProps({
    entity: newNode,
    props: {
      prevSiblingNodeId: sourceNode.id,
      nextSiblingNodeId: nextSiblingNode?.id,
    },
  })

  const __sourceNode = setNextSiblingNodeId({
    entity: sourceNode,
    nodeId: __newNode.id,
  })

  return {
    ...entity,
    nodeTable: setNodes({
      entity: entity.nodeTable,
      nodes: [__sourceNode, __newNode, nextSiblingNode].filter((node) => node !== undefined),
    }),
  }
}

const __setPrevSiblingNodeIdOfNextSiblingNode = ({
  entity,
  sourceNode,
  newNodeId,
}: {
  entity: TreeEntity
  sourceNode: NodeEntity
  newNodeId: NodeEntity['id']
}) => {
  let nextSiblingNode: NodeEntity | undefined

  if (sourceNode.nextSiblingNodeId) {
    nextSiblingNode = getNode({
      entity: entity.nodeTable,
      nodeId: sourceNode.nextSiblingNodeId,
    })

    if (nextSiblingNode) {
      nextSiblingNode = setPrevSiblingNodeId({
        entity: nextSiblingNode,
        nodeId: newNodeId,
      })
    }
  }

  return nextSiblingNode
}

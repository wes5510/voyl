import { TaskEntity } from './task'

export type NodeEntityId = string

export interface NodeEntity {
  id: NodeEntityId
  prevSiblingNodeId?: NodeEntityId
  nextSiblingNodeId?: NodeEntityId
  parentNodeId?: NodeEntityId
  childNodeIds: NodeEntityId[]
  collapsed: boolean
  task: TaskEntity
}

export const isRootNode = ({ entity }: { entity: NodeEntity }): boolean =>
  entity.parentNodeId === undefined

export const createTask = ({ id, title }: { id: string; title: string }): TaskEntity => ({
  id,
  title,
  done: false,
})

export const hasPrevSiblingNode = ({ entity }: { entity: NodeEntity }): boolean =>
  entity.prevSiblingNodeId !== undefined

export const hasChildNode = ({ entity }: { entity: NodeEntity }): boolean =>
  entity.childNodeIds.length > 0

export const removeChildNode = ({
  entity,
  childId,
}: {
  entity: NodeEntity
  childId: string
}): NodeEntity => ({
  ...entity,
  childNodeIds: entity.childNodeIds.filter((id) => id !== childId),
})

export const setNextSiblingNodeId = ({
  entity,
  nextSiblingNodeId,
}: {
  entity: NodeEntity
  nextSiblingNodeId: string
}): NodeEntity => ({
  ...entity,
  nextSiblingNodeId,
})

export const setPrevSiblingNodeId = ({
  entity,
  prevSiblingNodeId,
}: {
  entity: NodeEntity
  prevSiblingNodeId: string
}): NodeEntity => ({
  ...entity,
  prevSiblingNodeId,
})

export const addFirstChildNode = ({
  entity,
  newNodeId,
}: {
  entity: NodeEntity
  newNodeId: string
}): NodeEntity => ({
  ...entity,
  childNodeIds: [newNodeId, ...entity.childNodeIds],
})

export const addLastChildNode = ({
  entity,
  newNodeId,
}: {
  entity: NodeEntity
  newNodeId: string
}): NodeEntity => ({
  ...entity,
  childNodeIds: [...entity.childNodeIds, newNodeId],
})

export const setParentNodeId = ({
  entity,
  parentNodeId,
}: {
  entity: NodeEntity
  parentNodeId: string
}): NodeEntity => ({
  ...entity,
  parentNodeId,
})

export const collapse = ({ entity }: { entity: NodeEntity }): NodeEntity =>
  __setCollapsed({ entity, collapsed: true })

export const expand = ({ entity }: { entity: NodeEntity }): NodeEntity =>
  __setCollapsed({ entity, collapsed: false })

const __setCollapsed = ({
  entity,
  collapsed,
}: {
  entity: NodeEntity
  collapsed: boolean
}): NodeEntity => ({
  ...entity,
  collapsed,
})

export const getChildNodeIds = ({ entity }: { entity: NodeEntity }): string[] => entity.childNodeIds

export const getParentNodeId = ({ entity }: { entity: NodeEntity }): string | undefined =>
  entity.parentNodeId

export const getPrevSiblingNodeId = ({ entity }: { entity: NodeEntity }): string | undefined =>
  entity.prevSiblingNodeId

export const getNextSiblingNodeId = ({ entity }: { entity: NodeEntity }): string | undefined =>
  entity.nextSiblingNodeId

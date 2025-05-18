import { createNewTask, setTitle, TaskEntity } from './task'
import { v4 as uuidv4 } from 'uuid'

export type NodeEntityId = string

export interface NodeEntity {
  id: NodeEntityId
  parentNodeId?: NodeEntityId
  childNodeIds: NodeEntityId[]
  task: TaskEntity
}

export const setTaskTitle = ({
  entity,
  title,
}: {
  entity: NodeEntity
  title: string
}): NodeEntity => {
  return {
    ...entity,
    task: setTitle({ entity: entity.task, title }),
  }
}

export const getTaskTitle = ({ entity }: { entity: NodeEntity }): string => {
  return entity.task.title
}

export const createNewNode = ({ title = '' }: { title?: string } = {}): NodeEntity => {
  return {
    id: uuidv4(),
    childNodeIds: [],
    task: createNewTask({ title }),
  }
}

export const removeChildNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeEntity
  nodeId: string
}): NodeEntity => {
  return {
    ...entity,
    childNodeIds: entity.childNodeIds.filter((id) => id !== nodeId),
  }
}

export const getParentNodeId = ({ entity }: { entity: NodeEntity }): string | undefined => {
  return entity.parentNodeId
}

export const getChildNodeIds = ({ entity }: { entity: NodeEntity }): NodeEntityId[] => {
  return entity.childNodeIds
}

export const insertChildNodeId = ({
  entity,
  newNodeId,
  index,
}: {
  entity: NodeEntity
  newNodeId: string
  index: number
}): NodeEntity => {
  const newIds = [...entity.childNodeIds]
  newIds.splice(index, 0, newNodeId)

  return {
    ...entity,
    childNodeIds: newIds,
  }
}

export const setParentNodeId = ({
  entity,
  parentNodeId,
}: {
  entity: NodeEntity
  parentNodeId: string
}): NodeEntity => {
  return {
    ...entity,
    parentNodeId,
  }
}

export const getChildNodeIndex = ({
  entity,
  childNodeId,
}: {
  entity: NodeEntity
  childNodeId: string
}): number => {
  return entity.childNodeIds.indexOf(childNodeId)
}

export const getPrevSiblingChildNodeId = ({
  entity,
  childNodeId,
}: {
  entity: NodeEntity
  childNodeId: NodeEntityId
}) => {
  const childNodeIds = getChildNodeIds({ entity })
  const index = childNodeIds.indexOf(childNodeId)

  if (index === 0) {
    return undefined
  }

  return childNodeIds[index - 1]
}

export const getLastChildNodeIndex = ({ entity }: { entity: NodeEntity }): number => {
  return entity.childNodeIds.length - 1
}

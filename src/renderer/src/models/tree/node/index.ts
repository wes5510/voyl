import { createNewTask, setTitle, TaskEntity } from './task'
import { v4 as uuidv4 } from 'uuid'

export interface NodeEntity {
  id: string
  prevSiblingNodeId?: string
  nextSiblingNodeId?: string
  parentNodeId?: string
  childNodeIds: string[]
  collapsed: boolean
  task: TaskEntity
}

export const toggleCollapsed = ({ entity }: { entity: NodeEntity }): NodeEntity => {
  return {
    ...entity,
    collapsed: !entity.collapsed,
  }
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
    collapsed: false,
    task: createNewTask({ title }),
  }
}

export const setPrevSiblingNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeEntity
  nodeId: string
}): NodeEntity => {
  return {
    ...entity,
    prevSiblingNodeId: nodeId,
  }
}

export const setNextSiblingNodeId = ({
  entity,
  nodeId,
}: {
  entity: NodeEntity
  nodeId: string
}): NodeEntity => {
  return {
    ...entity,
    nextSiblingNodeId: nodeId,
  }
}

export const setNodeProps = ({
  entity,
  props,
}: {
  entity: NodeEntity
  props: Partial<NodeEntity>
}): NodeEntity => {
  return {
    ...entity,
    ...props,
  }
}

export const prependChildNodeId = ({
  entity,
  newNodeId,
}: {
  entity: NodeEntity
  newNodeId: string
}): NodeEntity => {
  return {
    ...entity,
    childNodeIds: [newNodeId, ...entity.childNodeIds],
  }
}

export const getPrevSiblingNodeId = ({ entity }: { entity: NodeEntity }): string | undefined => {
  return entity.prevSiblingNodeId
}

export const getNextSiblingNodeId = ({ entity }: { entity: NodeEntity }): string | undefined => {
  return entity.nextSiblingNodeId
}

export const getParentNodeId = ({ entity }: { entity: NodeEntity }): string | undefined => {
  return entity.parentNodeId
}

export const getChildNodeIds = ({ entity }: { entity: NodeEntity }): string[] => {
  return entity.childNodeIds
}

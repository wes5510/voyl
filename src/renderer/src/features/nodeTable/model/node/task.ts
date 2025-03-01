export interface TaskEntity {
  id: string
  title: string
}

export const updateTitle = ({
  entity,
  title,
}: {
  entity: TaskEntity
  title: string
}): TaskEntity => ({ ...entity, title })

export const truncateTitleAt = ({
  entity,
  index,
}: {
  entity: TaskEntity
  index: number
}): TaskEntity => ({ ...entity, title: entity.title.slice(0, index) })

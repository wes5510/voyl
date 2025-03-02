export interface TaskEntity {
  id: string
  title: string
  done: boolean
}

export const setTitle = ({ entity, title }: { entity: TaskEntity; title: string }): TaskEntity => {
  return {
    ...entity,
    title,
  }
}

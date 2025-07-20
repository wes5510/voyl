import { v4 as uuidv4 } from 'uuid'

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

export const createNewTask = ({
  title = '',
  done = false,
}: {
  title?: string
  done?: boolean
} = {}): TaskEntity => {
  return {
    id: uuidv4(),
    title,
    done,
  }
}

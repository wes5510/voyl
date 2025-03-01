export interface TaskEntity {
  title: string
  done: boolean
}

export const createNewTask = ({
  title = '',
  done = false,
}: {
  title?: string
  done?: boolean
}): TaskEntity => {
  return {
    title,
    done,
  }
}

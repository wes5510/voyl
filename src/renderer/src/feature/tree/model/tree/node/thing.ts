import { v4 as uuid } from 'uuid'

export interface ThingModel {
  id: string
  title: string
  content: string
}

export const createThing = ({
  title,
  content = '',
}: {
  title: string
  content?: string
}): ThingModel => ({ id: uuid(), title, content })

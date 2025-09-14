import { MAX_PATH_LENGTH } from './const'

export const truncatePath = (path: string) => {
  return path.length > MAX_PATH_LENGTH
    ? `...${path.slice(-MAX_PATH_LENGTH)}`
    : path
}

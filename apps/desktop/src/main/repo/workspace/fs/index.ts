import fse from 'fs-extra'
import { FILE_NAME } from './const.js'
import path from 'path'
import { Workspace } from '../type.js'

let filePath: string | null = null

export const initializePath = ({
  workspacePath,
}: {
  workspacePath: string
}) => {
  filePath = path.join(workspacePath, FILE_NAME)
}

export const getFilePath = () => {
  if (!filePath) {
    throw new Error('File path not initialized')
  }
  return filePath
}

export const create = async (): Promise<void> => {
  await fse.outputJson(getFilePath(), {
    nodeTypes: [],
    attributes: [],
  })
}

export const getMtimeMs = async (): Promise<number | null> => {
  const stats = await fse.stat(getFilePath())
  return stats.mtimeMs
}

export const read = async (): Promise<Workspace> => {
  const data = await fse.readJson(getFilePath())
  return data
}

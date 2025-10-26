import fse from 'fs-extra'
import { FILE_NAME } from './const.js'
import path from 'path'
import { Workspace } from '../type.js'

let _workspaceDirPath: string | null = null

export const initializePath = ({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}) => {
  _workspaceDirPath = workspaceDirPath
}

export const getWorkspaceDirPath = () => {
  if (!_workspaceDirPath) {
    throw new Error('Workspace directory path not initialized')
  }
  return _workspaceDirPath
}

export const getConfigPath = () => {
  return path.join(getWorkspaceDirPath(), FILE_NAME)
}

export const create = async (): Promise<void> => {
  await fse.outputJson(getConfigPath(), {
    nodeTypes: [],
    attributes: [],
  })
}

export const getMtimeMs = async (): Promise<number | null> => {
  const stats = await fse.stat(getConfigPath())
  return stats.mtimeMs
}

export const read = async (): Promise<Workspace> => {
  const data = await fse.readJson(getConfigPath())
  return data
}

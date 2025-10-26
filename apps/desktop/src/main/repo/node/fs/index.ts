import { FILE_EXTENSION, NODE_DIR_NAME } from './const.js'
import path from 'path'
import fse from 'fs-extra'
import { Node } from '../type.js'

let _nodeDirPath: string | null = null

const getNodeDirPath = (): string => {
  if (!_nodeDirPath) {
    throw new Error('Node directory path not initialized')
  }
  return _nodeDirPath
}

export const initializePath = ({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}) => {
  _nodeDirPath = path.join(workspaceDirPath, NODE_DIR_NAME)
}

export const create = async (): Promise<void> => {
  await fse.ensureDir(getNodeDirPath())
}

export const getIds = async (): Promise<string[]> => {
  const files = await fse.readdir(getNodeDirPath())
  return files
    .filter((file) => file.endsWith(FILE_EXTENSION))
    .map((file) => file.replace(FILE_EXTENSION, ''))
}

export const getFilePath = ({ id }: { id: string }): string => {
  return path.join(getNodeDirPath(), `${id}${FILE_EXTENSION}`)
}

export const getMtimeMs = async ({
  id,
}: {
  id: string
}): Promise<number | null> => {
  const stat = await fse.stat(getFilePath({ id }))
  return stat.mtimeMs
}

export const read = async ({ id }: { id: string }): Promise<Node> => {
  const data = await fse.readJson(getFilePath({ id }))
  return data
}

import { FILE_EXTENSION, NODE_DIR_NAME } from './const.js'
import path from 'path'
import fse from 'fs-extra'
// eslint-disable-next-line voyl/same-level-import
import type { Node } from '../db/index.js'

let _nodeDirPath: string | null = null

function getNodeDirPath(): string {
  if (!_nodeDirPath) {
    throw new Error('Node directory path not initialized')
  }

  return _nodeDirPath
}

function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  _nodeDirPath = path.join(workspaceDirPath, NODE_DIR_NAME)
}

async function create(): Promise<void> {
  await fse.ensureDir(getNodeDirPath())
}

async function getIds(): Promise<string[]> {
  const files = await fse.readdir(getNodeDirPath())
  return files
    .filter((file) => file.endsWith(FILE_EXTENSION))
    .map((file) => file.replace(FILE_EXTENSION, ''))
}

function getFilePath({ id }: { id: string }): string {
  return path.join(getNodeDirPath(), `${id}${FILE_EXTENSION}`)
}

async function getMtimeMs({ id }: { id: string }): Promise<number | null> {
  const stat = await fse.stat(getFilePath({ id }))
  return stat.mtimeMs
}

async function read({ id }: { id: string }): Promise<Node> {
  const data = await fse.readJson(getFilePath({ id }))
  return data
}

const NodeFs = {
  getNodeDirPath,
  setPath,
  create,
  getIds,
  getFilePath,
  getMtimeMs,
  read,
}

export default NodeFs

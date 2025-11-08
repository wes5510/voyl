import fse from 'fs-extra'
import { FILE_NAME } from './const.js'
import path from 'path'
// eslint-disable-next-line voyl/same-level-import
import type { Workspace } from '../db/index.js'

let _workspaceDirPath: string | null = null

function initializePath({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): void {
  _workspaceDirPath = workspaceDirPath
}

function getWorkspaceDirPath(): string {
  if (!_workspaceDirPath) {
    throw new Error('Workspace directory path not initialized')
  }
  return _workspaceDirPath
}

function getConfigPath(): string {
  return path.join(getWorkspaceDirPath(), FILE_NAME)
}

async function create(): Promise<void> {
  await fse.outputJson(getConfigPath(), {
    nodeTypes: [],
    attributes: [],
  })
}

async function getMtimeMs(): Promise<number | null> {
  const stats = await fse.stat(getConfigPath())
  return stats.mtimeMs
}

async function read(): Promise<Workspace> {
  const data = await fse.readJson(getConfigPath())
  return data
}

const WorkspaceFs = {
  initializePath,
  getWorkspaceDirPath,
  getConfigPath,
  create,
  getMtimeMs,
  read,
}

export default WorkspaceFs

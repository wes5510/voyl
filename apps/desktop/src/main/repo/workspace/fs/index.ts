import fse from 'fs-extra'
import { FILE_NAME } from './const.js'
import path from 'path'
import type { Workspace } from '../db/index.js'

let _workspaceDirPath: string | null = null

export function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  _workspaceDirPath = workspaceDirPath
}

export function getWorkspaceDirPath(): string {
  if (!_workspaceDirPath) {
    throw new Error('Workspace directory path not initialized')
  }
  return _workspaceDirPath
}

export function getConfigPath(): string {
  return path.join(getWorkspaceDirPath(), FILE_NAME)
}

export async function create(): Promise<void> {
  await fse.outputJson(getConfigPath(), {
    nodeTypes: [],
    attributes: [],
  })
}

export async function getMtimeMs(): Promise<number | null> {
  const stats = await fse.stat(getConfigPath())
  return stats.mtimeMs
}

export async function read(): Promise<Workspace> {
  const data = await fse.readJson(getConfigPath())
  return data
}

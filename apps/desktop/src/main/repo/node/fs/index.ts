import { FILE_EXTENSION, NODE_DIR_NAME } from './const.js'
import path from 'path'
import fse from 'fs-extra'
import type { Node } from '../db/index.js'

let _nodeDirPath: string | null = null

export function getNodeDirPath(): string {
  if (!_nodeDirPath) {
    throw new Error('Node directory path not initialized')
  }

  return _nodeDirPath
}

export function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  _nodeDirPath = path.join(workspaceDirPath, NODE_DIR_NAME)
}

export async function create(): Promise<void> {
  await fse.ensureDir(getNodeDirPath())
}

export async function getIds(): Promise<string[]> {
  const files = await fse.readdir(getNodeDirPath())
  return files
    .filter((file) => file.endsWith(FILE_EXTENSION))
    .map((file) => file.replace(FILE_EXTENSION, ''))
}

export function getFilePath({ id }: { id: string }): string {
  return path.join(getNodeDirPath(), `${id}${FILE_EXTENSION}`)
}

export async function getMtimeMs({ id }: { id: string }): Promise<number | null> {
  try {
    const stat = await fse.stat(getFilePath({ id }))
    return stat.mtimeMs
  } catch {
    return null
  }
}

export async function read({ id }: { id: string }): Promise<Node> {
  const data = await fse.readJson(getFilePath({ id }))
  return data
}

export async function write({ id, data }: { id: string; data: Node }): Promise<void> {
  await fse.writeJson(getFilePath({ id }), data)
}

export async function update({
  id,
  updates,
}: {
  id: string
  updates: Partial<Omit<Node, 'id'>>
}): Promise<Node> {
  const currentData = await read({ id })
  const updatedData: Node = {
    ...currentData,
    ...updates,
  }
  await write({ id, data: updatedData })

  return updatedData
}

export async function remove({ id }: { id: string }): Promise<string> {
  const filePath = getFilePath({ id })
  await fse.remove(filePath)
  return filePath
}

export async function removeNodes({ ids }: { ids: string[] }): Promise<string[]> {
  return await Promise.all(ids.map((id) => remove({ id })))
}

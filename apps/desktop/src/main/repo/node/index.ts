import { v4 as uuidv4 } from 'uuid'
import * as NodeFs from './fs/index.js'
import * as NodeDb from './db/index.js'
import * as SyncMetadataRepo from '../syncMetadata/index.js'

export type { Node, NewNode } from './db/index.js'
import type { Node, NewNode } from './db/index.js'

export async function initialize(): Promise<void> {
  await NodeFs.create()
  await NodeDb.createTable()
}

export function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  NodeFs.setPath({ workspaceDirPath })
}

export async function syncSingle({ id }: { id: string }): Promise<void> {
  const mtimeMs = await NodeFs.getMtimeMs({ id })
  let data: Node | null = null

  try {
    data = await NodeFs.read({ id })
  } catch {
    /* empty */
  }

  await SyncMetadataRepo.sync<Node>({
    fs: {
      path: NodeFs.getFilePath({ id }),
      data,
      mtimeMs: mtimeMs,
    },
    db: {
      tableName: NodeDb.TABLE_NAME,
      isExists: await NodeDb.exists({ id }),
      handler: {
        update: NodeDb.update,
        createTable: NodeDb.createTable,
        add: NodeDb.add,
        remove: () => NodeDb.remove({ id }),
      },
    },
  })
}

async function syncNodes({ ids }: { ids: string[] }) {
  return await Promise.all(
    ids.map(async (id: string) => {
      return await syncSingle({ id })
    }),
  )
}

export async function sync(): Promise<void> {
  const ids = await NodeFs.getIds()

  await syncNodes({ ids })
}

export async function addNode(node: NewNode): Promise<Node> {
  const id = node.id ?? uuidv4()
  const fullNode: Node = {
    id,
    parentId: node.parentId ?? null,
    childIds: node.childIds ?? [],
    title: node.title ?? '',
    content: node.content ?? '',
  }
  await NodeFs.write({ id, data: fullNode })
  await syncSingle({ id })

  return fullNode
}

export async function getChildIds({ id }: { id: string }): Promise<string[]> {
  return await NodeDb.getChildIds({ id })
}

export async function getNodeById({ id }: { id: string }): Promise<Node | null> {
  return await NodeDb.getNodeById({ id })
}

export async function updateNodeTitle({
  id,
  title,
}: {
  id: string
  title: string
}): Promise<Node> {
  const updatedData = await NodeFs.update({ id, updates: { title } })
  await syncSingle({ id })
  return updatedData
}

export async function updateChildIds({
  id,
  childIds,
}: {
  id: string
  childIds: string[]
}): Promise<Node> {
  const updatedData = await NodeFs.update({ id, updates: { childIds } })
  await syncSingle({ id })
  return updatedData
}

export async function isNodeExist({ id }: { id: string }) {
  return await NodeDb.exists({ id })
}

export async function getParentId({ id }: { id: string }): Promise<string | null> {
  return await NodeDb.getParentId({ id })
}

export async function updateParentId({
  id,
  parentId,
}: {
  id: string
  parentId: string
}): Promise<Node> {
  const updatedData = await NodeFs.update({ id, updates: { parentId } })
  await syncSingle({ id })
  return updatedData
}

export async function removeNode({ id }: { id: string }) {
  await NodeFs.remove({ id })
  await syncSingle({ id })
}

export async function removeNodes({ ids }: { ids: string[] }) {
  const removedFilePaths = await NodeFs.removeNodes({ ids })
  await SyncMetadataRepo.removePaths({ paths: removedFilePaths })
  await syncNodes({ ids })
}

import { v4 as uuidv4 } from 'uuid'
import NodeFs from './fs/index.js'
import NodeDb, { type Node, type NewNode } from './db/index.js'
import SyncMetadataRepo from '../syncMetadata/index.js'

export type { Node, NewNode }

async function initialize(): Promise<void> {
  await NodeFs.create()
  await NodeDb.createTable()
}

function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  NodeFs.setPath({ workspaceDirPath })
}

async function syncSingle({ id }: { id: string }): Promise<void> {
  const mtimeMs = await NodeFs.getMtimeMs({ id })

  await SyncMetadataRepo.sync<Node>({
    fs: {
      path: NodeFs.getFilePath({ id }),
      data: await NodeFs.read({ id }),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: NodeDb.TABLE_NAME,
      isExists: await NodeDb.exists({ id }),
      handler: {
        update: NodeDb.update,
        createTable: NodeDb.createTable,
        add: NodeDb.add,
      },
    },
  })
}

async function sync(): Promise<void> {
  const ids = await NodeFs.getIds()

  await Promise.all(
    ids.map(async (id: string) => {
      await syncSingle({ id })
    }),
  )
}

async function addNode(node: NewNode): Promise<Node> {
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

async function getChildIds({ id }: { id: string }): Promise<string[]> {
  return await NodeDb.getChildIds({ id })
}

async function getNodeById({ id }: { id: string }): Promise<Node | null> {
  return await NodeDb.getNodeById({ id })
}

async function updateNodeTitle({
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

async function updateChildIds({
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

async function isNodeExist({ id }: { id: string }) {
  return await NodeDb.exists({ id })
}

async function getParentId({ id }: { id: string }): Promise<string | null> {
  return await NodeDb.getParentId({ id })
}

async function updateParentId({
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

const NodeRepo = {
  initialize,
  setPath,
  syncSingle,
  sync,
  addNode,
  getChildIds,
  getNodeById,
  updateNodeTitle,
  isNodeExist,
  getParentId,
  updateChildIds,
  updateParentId,
}

export default NodeRepo

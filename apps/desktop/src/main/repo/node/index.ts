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

async function addNode(node: NewNode): Promise<void> {
  const id = node.id ?? uuidv4()
  const fullNode: Node = {
    id,
    childIds: node.childIds ?? [],
    title: node.title ?? '',
    content: node.content ?? '',
  }
  await NodeFs.write({ id, data: fullNode })
  await syncSingle({ id })
}

const NodeRepo = {
  initialize,
  setPath,
  syncSingle,
  sync,
  addNode,
}

export default NodeRepo

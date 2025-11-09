import NodeFs from './fs/index.js'
import NodeDb, { type Node } from './db/index.js'
import SyncMetadataRepo from '../syncMetadata/index.js'

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

const NodeRepo = {
  initialize,
  setPath,
  syncSingle,
  sync,
}

export default NodeRepo

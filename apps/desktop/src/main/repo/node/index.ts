import NodeFs from './fs/index.js'
import NodeDb from './db/index.js'
// eslint-disable-next-line voyl/same-level-import
import SyncMetadataRepo from '../syncMetadata/index.js'
import { Node } from './type.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  initializePath({ workspaceDirPath })
  await NodeFs.create()
  await NodeDb.createTable()
}

function initializePath({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): void {
  NodeFs.initializePath({ workspaceDirPath })
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
  initializePath,
  syncSingle,
  sync,
}

export default NodeRepo

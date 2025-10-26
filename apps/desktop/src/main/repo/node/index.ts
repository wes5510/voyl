import * as fs from './fs/index.js'
import * as db from './db/index.js'
// eslint-disable-next-line voyl/same-level-import
import * as SyncMetadataRepo from '../syncMetadata/index.js'
import { Node } from './type.js'

export const initialize = async ({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> => {
  initializePath({ workspaceDirPath })
  await fs.create()
  await db.createTable()
}

export const initializePath = ({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): void => {
  fs.initializePath({ workspaceDirPath })
}

const syncSingle = async ({ id }: { id: string }): Promise<void> => {
  const mtimeMs = await fs.getMtimeMs({ id })

  await SyncMetadataRepo.sync<Node>({
    fs: {
      path: fs.getFilePath({ id }),
      data: await fs.read({ id }),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: db.TABLE_NAME,
      isExists: await db.exists({ id }),
      handler: {
        update: db.update,
        createTable: db.createTable,
        add: db.add,
      },
    },
  })
}

export const sync = async (): Promise<void> => {
  const ids = await fs.getIds()

  await Promise.all(
    ids.map(async (id: string) => {
      await syncSingle({ id })
    }),
  )
}

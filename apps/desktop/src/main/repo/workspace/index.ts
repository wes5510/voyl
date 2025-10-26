import * as db from './db/index.js'
import * as fs from './fs/index.js'
// eslint-disable-next-line voyl/same-level-import
import * as SyncMetadataRepo from '../syncMetadata/index.js'
import { Workspace } from './type.js'

export const initialize = async ({
  workspacePath,
}: {
  workspacePath: string
}): Promise<void> => {
  fs.initializePath({ workspacePath })
  await fs.create()
  await db.createTable()
}

export const initializePath = ({
  workspacePath,
}: {
  workspacePath: string
}) => {
  fs.initializePath({ workspacePath })
}

export const sync = async (): Promise<void> => {
  const mtimeMs = await fs.getMtimeMs()

  await SyncMetadataRepo.sync<Workspace>({
    fs: {
      path: fs.getFilePath(),
      data: await fs.read(),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: db.TABLE_NAME,
      isExists: await db.exists(),
      handler: {
        update: db.update,
        createTable: db.createTable,
        removeTable: db.removeTable,
        add: db.add,
      },
    },
  })
}

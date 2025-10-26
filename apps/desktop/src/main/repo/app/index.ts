import * as db from './db/index.js'
import * as fs from './fs/index.js'
// eslint-disable-next-line voyl/same-level-import
import * as syncMetadataRepo from '../syncMetadata/index.js'
import { App } from './type.js'

export const exists = async (): Promise<boolean> => {
  return await db.existsTable()
}

export const initialize = async ({
  workspaceDirPath,
  version,
}: {
  workspaceDirPath: string
  version: string
}): Promise<void> => {
  await fs.create({
    workspaceDirPath,
    version,
  })

  await db.createTable()
}

export const sync = async (): Promise<void> => {
  const mtimeMs = await fs.getMtimeMs()

  await syncMetadataRepo.sync<App>({
    fs: {
      path: fs.PATH,
      data: await fs.read(),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: db.TABLE_NAME,
      isExists: await db.exists(),
      handler: {
        update: db.update,
        createTable: db.createTable,
        add: db.add,
      },
    },
  })
}

export const getWorkspaceDirPath = async (): Promise<string | null> => {
  return await db.getWorkspaceDirPath()
}

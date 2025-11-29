import * as AppDb from './db/index.js'
import * as AppFs from './fs/index.js'
import * as SyncMetadataRepo from '../syncMetadata/index.js'
import type { App } from './db/index.js'

export async function exists(): Promise<boolean> {
  return await AppDb.existsTable()
}

export async function initialize({
  workspaceDirPath,
  version,
}: {
  workspaceDirPath: string
  version: string
}): Promise<void> {
  await AppFs.create({
    workspaceDirPath,
    version,
  })

  await AppDb.createTable()
}

export async function sync(): Promise<void> {
  const mtimeMs = await AppFs.getMtimeMs()

  await SyncMetadataRepo.sync<App>({
    fs: {
      path: AppFs.PATH,
      data: await AppFs.read(),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: AppDb.TABLE_NAME,
      isExists: await AppDb.exists(),
      handler: {
        update: AppDb.update,
        createTable: AppDb.createTable,
        add: AppDb.add,
        remove: () => AppDb.remove(),
      },
    },
  })
}

export async function getWorkspaceDirPath(): Promise<string | null> {
  return await AppDb.getWorkspaceDirPath()
}

import AppDb from './db/index.js'
import AppFs from './fs/index.js'
import SyncMetadataRepo from '../syncMetadata/index.js'
import type { App } from './db/index.js'

async function exists(): Promise<boolean> {
  return await AppDb.existsTable()
}

async function initialize({
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

async function sync(): Promise<void> {
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
      },
    },
  })
}

async function getWorkspaceDirPath(): Promise<string | null> {
  return await AppDb.getWorkspaceDirPath()
}

const AppRepo = {
  exists,
  initialize,
  sync,
  getWorkspaceDirPath,
}

export default AppRepo

import * as WorkspaceDb from './db/index.js'
import * as WorkspaceFs from './fs/index.js'
import * as SyncMetadataRepo from '../syncMetadata/index.js'
import type { Workspace } from './db/index.js'

export async function initialize(): Promise<void> {
  await WorkspaceFs.create()
  await WorkspaceDb.createTable()
}

export function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  WorkspaceFs.setPath({ workspaceDirPath })
}

export async function sync(): Promise<void> {
  const mtimeMs = await WorkspaceFs.getMtimeMs()

  await SyncMetadataRepo.sync<Workspace>({
    fs: {
      path: WorkspaceFs.getConfigPath(),
      data: await WorkspaceFs.read(),
      mtimeMs: mtimeMs ?? 0,
    },
    db: {
      tableName: WorkspaceDb.TABLE_NAME,
      isExists: await WorkspaceDb.exists(),
      handler: {
        update: WorkspaceDb.update,
        createTable: WorkspaceDb.createTable,
        add: WorkspaceDb.add,
        remove: () => WorkspaceDb.remove(),
      },
    },
  })
}

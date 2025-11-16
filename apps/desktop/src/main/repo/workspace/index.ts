import WorkspaceDb, { type Workspace } from './db/index.js'
import WorkspaceFs from './fs/index.js'
import SyncMetadataRepo from '../syncMetadata/index.js'

async function initialize(): Promise<void> {
  await WorkspaceFs.create()
  await WorkspaceDb.createTable()
}

function setPath({ workspaceDirPath }: { workspaceDirPath: string }): void {
  WorkspaceFs.setPath({ workspaceDirPath })
}

async function sync(): Promise<void> {
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

const WorkspaceRepo = {
  initialize,
  setPath,
  sync,
}

export default WorkspaceRepo

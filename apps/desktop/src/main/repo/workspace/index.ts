import WorkspaceDb, { type Workspace } from './db/index.js'
import WorkspaceFs from './fs/index.js'
// eslint-disable-next-line voyl/same-level-import
import SyncMetadataRepo from '../syncMetadata/index.js'

async function initialize({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): Promise<void> {
  WorkspaceFs.initializePath({ workspaceDirPath })
  await WorkspaceFs.create()
  await WorkspaceDb.createTable()
}

function initializePath({
  workspaceDirPath,
}: {
  workspaceDirPath: string
}): void {
  WorkspaceFs.initializePath({ workspaceDirPath })
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
      },
    },
  })
}

const WorkspaceRepo = {
  initialize,
  initializePath,
  sync,
}

export default WorkspaceRepo

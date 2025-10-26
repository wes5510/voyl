import { SYNC_STATE } from './const.js'
import SyncMetadataDb, { type SyncMetadata } from './db/index.js'

async function initialize(): Promise<void> {
  await SyncMetadataDb.createTable()
}

function getSyncState({
  fsMtimeMs,
  isDbExists,
  metadata,
}: {
  fsMtimeMs: number
  isDbExists: boolean
  metadata: SyncMetadata | null
}): (typeof SYNC_STATE)[keyof typeof SYNC_STATE] {
  if (!isDbExists) {
    return SYNC_STATE.FS_ONLY
  } else if (metadata === null || metadata.syncedAt < fsMtimeMs) {
    return SYNC_STATE.DB_OUTDATED
  }

  return SYNC_STATE.CONSISTENT
}

function handleConsistent() {}

async function handleFsOnly<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      add: (data: T) => void
    }
  }
}): Promise<void> {
  await db.handler.createTable()
  await db.handler.add(fs.data)
  await SyncMetadataDb.add({
    path: fs.path,
    tableName: db.tableName,
    syncedAt: fs.mtimeMs,
  })
}

async function handleDbOutdated<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      add: (data: T) => void
    }
  }
}): Promise<void> {
  await db.handler.update(fs.data)
  await SyncMetadataDb.update({
    path: fs.path,
    tableName: db.tableName,
    syncedAt: fs.mtimeMs,
  })
}

const syncStateToHandler = {
  [SYNC_STATE.FS_ONLY]: handleFsOnly,
  [SYNC_STATE.DB_OUTDATED]: handleDbOutdated,
  [SYNC_STATE.CONSISTENT]: handleConsistent,
} as const

async function sync<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    isExists: boolean
    handler: {
      update: (data: T) => void
      createTable: () => void
      add: (data: T) => void
    }
  }
}): Promise<void> {
  const metadata = await SyncMetadataDb.get({
    path: fs.path,
  })

  const syncState = await getSyncState({
    fsMtimeMs: fs?.mtimeMs ?? 0,
    isDbExists: db.isExists,
    metadata,
  })

  const handler = syncStateToHandler[syncState]
  await handler({
    fs,
    db,
  })
}

const SyncMetadataRepo = {
  initialize,
  getSyncState,
  handleConsistent,
  handleFsOnly,
  handleDbOutdated,
  sync,
}

export default SyncMetadataRepo

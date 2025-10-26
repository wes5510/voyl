import { SYNC_STATE } from './const.js'
import * as _db from './db/index.js'

export const initialize = async (): Promise<void> => {
  await _db.createTable()
}

const getSyncState = async ({
  fsMtimeMs,
  isFsExists,
  isDbExists,
  metadata,
}) => {
  if (isFsExists && !isDbExists) {
    return SYNC_STATE.FS_ONLY
  } else if (!isFsExists && isDbExists) {
    return SYNC_STATE.DB_ONLY
  } else if (
    isFsExists &&
    isDbExists &&
    (metadata === null || metadata.syncedAt < fsMtimeMs)
  ) {
    return SYNC_STATE.DB_OUTDATED
  }

  return SYNC_STATE.CONSISTENT
}

const handleConsistent = () => {}

const handleDbOnly = async <T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      removeTable: () => void
      add: (data: T) => void
    }
  }
}) => {
  await db.handler.removeTable()
  await _db.remove({
    path: fs.path,
  })
}

const handleFsOnly = async <T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      removeTable: () => void
      add: (data: T) => void
    }
  }
}) => {
  await db.handler.createTable()
  await db.handler.add(fs.data)
  await _db.add({
    path: fs.path,
    tableName: db.tableName,
    syncedAt: fs.mtimeMs,
  })
}

const handleDbOutdated = async ({ fs, db }) => {
  await db.handler.update(fs.data)
  await _db.update({
    path: fs.path,
    tableName: db.tableName,
    syncedAt: fs.mtimeMs,
  })
}

const syncStateToHandler = {
  [SYNC_STATE.DB_ONLY]: handleDbOnly,
  [SYNC_STATE.FS_ONLY]: handleFsOnly,
  [SYNC_STATE.DB_OUTDATED]: handleDbOutdated,
  [SYNC_STATE.CONSISTENT]: handleConsistent,
} as const

export const sync = async <T>({
  fs,
  db,
}: {
  fs: { path: string; data: T; mtimeMs: number }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      removeTable: () => void
      add: (data: T) => void
    }
  }
}) => {
  const metadata = await _db.get({
    path: fs.path,
  })

  const syncState = await getSyncState({
    fsMtimeMs: fs?.mtimeMs ?? 0,
    isFsExists: fs !== null,
    isDbExists: db !== null,
    metadata,
  })

  const handler = syncStateToHandler[syncState]
  await handler({
    fs,
    db,
  })
}

export const get = _db.get
export const remove = _db.remove
export const add = _db.add
export const update = _db.update

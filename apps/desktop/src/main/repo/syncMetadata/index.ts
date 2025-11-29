import { SYNC_STATE } from './const.js'
import * as SyncMetadataDb from './db/index.js'
import type { SyncMetadata } from './db/index.js'

export async function initialize(): Promise<void> {
  await SyncMetadataDb.createTable()
}

export function getSyncState({
  fsMtimeMs,
  isDbExists,
  metadata,
}: {
  fsMtimeMs: number | null
  isDbExists: boolean
  metadata: SyncMetadata | null
}): (typeof SYNC_STATE)[keyof typeof SYNC_STATE] {
  // 파일은 없지만 DB에는 있는 경우 (파일 삭제됨)
  if (fsMtimeMs === null && isDbExists) {
    return SYNC_STATE.DB_ONLY
  }

  // 파일만 있고 DB에는 없는 경우
  if (!isDbExists) {
    return SYNC_STATE.FS_ONLY
  }

  // DB가 오래된 경우
  if (metadata === null || (fsMtimeMs !== null && metadata.syncedAt < fsMtimeMs)) {
    return SYNC_STATE.DB_OUTDATED
  }

  return SYNC_STATE.CONSISTENT
}

export function handleConsistent() {}

export async function handleDbOnly({
  fs,
  db,
}: {
  fs: { path: string }
  db: {
    handler: {
      remove: () => Promise<void>
    }
  }
}): Promise<void> {
  await db.handler.remove()
  await SyncMetadataDb.remove({ path: fs.path })
}

export async function handleFsOnly<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T | null; mtimeMs: number | null }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      add: (data: T) => void
    }
  }
}): Promise<void> {
  if (fs.data === null || fs.mtimeMs === null) {
    return
  }

  await db.handler.createTable()
  await db.handler.add(fs.data)
  await SyncMetadataDb.add({
    path: fs.path,
    tableName: db.tableName,
    syncedAt: fs.mtimeMs,
  })
}

export async function handleDbOutdated<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T | null; mtimeMs: number | null }
  db: {
    tableName: string
    handler: {
      update: (data: T) => void
      createTable: () => void
      add: (data: T) => void
    }
  }
}): Promise<void> {
  if (fs.data === null || fs.mtimeMs === null) {
    return
  }

  await db.handler.update(fs.data)
  await SyncMetadataDb.update({
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

export async function sync<T>({
  fs,
  db,
}: {
  fs: { path: string; data: T | null; mtimeMs: number | null }
  db: {
    tableName: string
    isExists: boolean
    handler: {
      update: (data: T) => Promise<void>
      createTable: () => Promise<void>
      add: (data: T) => Promise<void>
      remove: () => Promise<void>
    }
  }
}): Promise<void> {
  const metadata = await SyncMetadataDb.get({
    path: fs.path,
  })

  const syncState = getSyncState({
    fsMtimeMs: fs.mtimeMs,
    isDbExists: db.isExists,
    metadata,
  })

  const handler = syncStateToHandler[syncState]
  await handler({
    fs,
    db,
  })
}

export async function removePaths({ paths }: { paths: string[] }): Promise<void> {
  await SyncMetadataDb.removePaths({ paths })
}

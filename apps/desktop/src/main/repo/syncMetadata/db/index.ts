import { syncMetadata, SyncMetadata } from './schema.js'
import * as db from '../../shared/db.js'
import { eq } from 'drizzle-orm'

export const createTable = async (): Promise<void> => {
  await db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sync_metadata (
      path TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      synced_at INTEGER NOT NULL
    )
  `)
}

export const get = async ({
  path,
}: {
  path: string
}): Promise<SyncMetadata | null> => {
  const result = await db.connection
    .select({
      path: syncMetadata.path,
      tableName: syncMetadata.tableName,
      syncedAt: syncMetadata.syncedAt,
    })
    .from(syncMetadata)
    .where(eq(syncMetadata.path, path))
    .limit(1)

  return result[0] ?? null
}

export const remove = async ({ path }: { path: string }): Promise<void> => {
  await db.connection.delete(syncMetadata).where(eq(syncMetadata.path, path))
}

export const add = async ({
  path,
  tableName,
  syncedAt,
}: {
  path: string
  tableName: string
  syncedAt: number
}): Promise<void> => {
  await db.connection.insert(syncMetadata).values({ path, tableName, syncedAt })
}

export const update = async ({
  path,
  tableName,
  syncedAt,
}: {
  path: string
  tableName: string
  syncedAt: number
}): Promise<void> => {
  await db.connection
    .update(syncMetadata)
    .set({ syncedAt, tableName })
    .where(eq(syncMetadata.path, path))
}

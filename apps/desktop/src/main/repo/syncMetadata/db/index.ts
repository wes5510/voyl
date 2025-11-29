import { syncMetadata, SyncMetadata } from './schema.js'
import Db from '../../shared/db.js'
import { eq, inArray } from 'drizzle-orm'

export type { SyncMetadata }

export async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sync_metadata (
      path TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      synced_at INTEGER NOT NULL
    )
  `)
}

export async function get({ path }: { path: string }): Promise<SyncMetadata | null> {
  const result = await Db.connection
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

export async function remove({ path }: { path: string }): Promise<void> {
  await Db.connection.delete(syncMetadata).where(eq(syncMetadata.path, path))
}

export async function add({
  path,
  tableName,
  syncedAt,
}: {
  path: string
  tableName: string
  syncedAt: number
}): Promise<void> {
  await Db.connection.insert(syncMetadata).values({ path, tableName, syncedAt })
}

export async function update({
  path,
  tableName,
  syncedAt,
}: {
  path: string
  tableName: string
  syncedAt: number
}): Promise<void> {
  await Db.connection
    .update(syncMetadata)
    .set({ syncedAt, tableName })
    .where(eq(syncMetadata.path, path))
}

export async function removePaths({ paths }: { paths: string[] }): Promise<void> {
  await Db.connection
    .delete(syncMetadata)
    .where(inArray(syncMetadata.path, paths))
}

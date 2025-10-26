import { syncMetadata, SyncMetadata } from './schema.js'
import Db from '../../shared/db.js'
import { eq } from 'drizzle-orm'

async function createTable(): Promise<void> {
  await Db.sqlite.exec(`
    CREATE TABLE IF NOT EXISTS sync_metadata (
      path TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      synced_at INTEGER NOT NULL
    )
  `)
}

async function get({ path }: { path: string }): Promise<SyncMetadata | null> {
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

async function remove({ path }: { path: string }): Promise<void> {
  await Db.connection.delete(syncMetadata).where(eq(syncMetadata.path, path))
}

async function add({
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

async function update({
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

const SyncMetadataDb = {
  createTable,
  get,
  remove,
  add,
  update,
}

export default SyncMetadataDb

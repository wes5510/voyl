import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const syncMetadata = sqliteTable('sync_metadata', {
  path: text('path').primaryKey(),
  tableName: text('table_name').notNull(),
  syncedAt: integer('synced_at').notNull(),
})

export type SyncMetadata = typeof syncMetadata.$inferSelect
export type NewSyncMetadata = typeof syncMetadata.$inferInsert

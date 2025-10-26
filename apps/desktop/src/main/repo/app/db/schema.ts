import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { TABLE_NAME } from './const.js'

export const app = sqliteTable(TABLE_NAME, {
  version: text('version').notNull().default('0.0.0'),
  workspaceDirPath: text('workspace_dir_path'),
})

export type App = typeof app.$inferSelect
export type NewApp = typeof app.$inferInsert

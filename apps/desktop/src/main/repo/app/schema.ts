import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const app = sqliteTable('app', {
  version: text('version').notNull().default('0.0.0'),
  workspacePath: text('workspace_path'),
})

export type App = typeof app.$inferSelect
export type NewApp = typeof app.$inferInsert

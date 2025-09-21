import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const workspace = sqliteTable('workspace', {
  nodeTypes: text('node_types', { mode: 'json' }).default('[]'),
  attributes: text('attributes', { mode: 'json' }).default('[]'),
})

export type Workspace = typeof workspace.$inferSelect
export type NewWorkspace = typeof workspace.$inferInsert

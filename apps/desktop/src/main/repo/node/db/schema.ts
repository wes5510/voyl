import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { TABLE_NAME } from './const.js'

export const nodes = sqliteTable(TABLE_NAME, {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  parentId: text('parent_id'),
  childIds: text('child_ids', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => sql`'[]'`),
  title: text('title').notNull().default(''),
  content: text('content').notNull().default(''),
})

export type Node = typeof nodes.$inferSelect
export type NewNode = typeof nodes.$inferInsert

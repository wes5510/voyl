import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { nodeTypes } from '../nodeType/schema.js' // NodeType 스키마 import

export const nodes = sqliteTable('nodes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  parentId: text('parent_id').references(() => nodes.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  index: text('index').notNull(),
  attributeIds: text('attribute_ids', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => sql`'[]'`),
  title: text('title').notNull().default(''),
  content: text('content').notNull().default(''),
  typeId: text('type_id').references(() => nodeTypes.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
})

export type Node = typeof nodes.$inferSelect
export type NewNode = typeof nodes.$inferInsert

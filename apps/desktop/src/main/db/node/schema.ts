import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'
import { nodeTypes } from '../nodeType/schema' // NodeType 스키마 import

/**
 * Node 모델은 트리 구조의 기본 단위입니다.
 * 각 노드는 제목, 내용, 타입, 부모/자식 관계 및 여러 속성(Attribute) ID 목록을 가질 수 있습니다.
 *
 * - id: 노드의 고유 식별자 (UUID v4)
 * - parentId: 부모 노드의 ID. 최상위 노드는 null 값을 가집니다.
 * - childIds: 자식 노드들의 ID 배열. 순서가 중요하며 JSON 문자열로 저장됩니다.
 * - attributeIds: 이 노드에 속한 Attribute들의 ID 배열. JSON 문자열로 저장됩니다.
 * - title: 노드의 제목. 빈 문자열이 가능합니다.
 * - content: 노드의 상세 내용. TipTap 등 WYSIWYG 에디터의 내용이 저장될 수 있습니다. (JSON 또는 HTML)
 * - typeId: 노드의 타입을 나타내는 ID. nodeTypes 테이블의 id를 참조합니다.
 */
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

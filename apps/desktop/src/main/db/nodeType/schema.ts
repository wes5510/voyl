import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'
import { sql } from 'drizzle-orm'

/**
 * `node_types` 테이블 스키마
 * 노드의 유형(예: 태스크, 구글 캘린더 스케쥴)을 정의합니다.
 *
 * - id: 노드 유형의 고유 ID (UUID v4)
 * - name: 노드 유형의 이름 (예: "태스크", "일정")
 * - definedAttributeNames: 해당 노드 유형에 미리 정의된 속성들의 이름 또는 ID 목록 (JSON 문자열로 저장).
 *                        예: 태스크 유형은 ["마감일", "완료여부"] 등을 가질 수 있습니다.
 */
export const nodeTypes = sqliteTable('node_types', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  definedAttributeNames: text('defined_attribute_names', { mode: 'json' })
    .notNull()
    .$type<string[]>()
    .$defaultFn(() => sql`'[]'`),
})

export type NodeType = typeof nodeTypes.$inferSelect
export type NewNodeType = typeof nodeTypes.$inferInsert

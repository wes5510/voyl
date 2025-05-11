import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuidv4 } from 'uuid'

/**
 * Attribute 모델은 Node에 추가적인 정보를 제공하는 속성을 관리합니다.
 * 예: 마감일, 완료 여부, 숫자 값, 텍스트 설명 등
 *
 * - id: 속성의 고유 식별자 (UUID v4)
 * - name: 속성의 이름 (예: "dueDate", "isCompleted", "priority")
 * - value: 속성의 값. 다양한 타입을 저장하기 위해 JSON 형식으로 저장됩니다.
 *          (예: '2023-10-20', true, 1, "상세 설명")
 */
export const attributes = sqliteTable('attributes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  value: text('value', { mode: 'json' }),
})

export type Attribute = typeof attributes.$inferSelect
export type NewAttribute = typeof attributes.$inferInsert

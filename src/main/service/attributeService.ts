import { db } from '../db/connect.js'
import { attributes, NewAttribute, Attribute } from '../db/schemas/attributes.js'
import { eq } from 'drizzle-orm'

/**
 * 새로운 속성을 생성합니다.
 * @param data 생성할 속성의 데이터 (name, value). id는 자동으로 생성됩니다.
 * @returns 생성된 속성 객체
 */
export async function createAttribute(data: Omit<NewAttribute, 'id'>): Promise<Attribute> {
  const [result] = await db.insert(attributes).values(data).returning()
  return result
}

/**
 * ID로 특정 속성을 조회합니다.
 * @param attributeId 조회할 속성의 ID
 * @returns 조회된 속성 객체 또는 undefined (찾지 못한 경우)
 */
export async function getAttributeById(attributeId: string): Promise<Attribute | undefined> {
  const [result] = await db.select().from(attributes).where(eq(attributes.id, attributeId))
  return result || undefined
}

/**
 * 속성의 값을 업데이트합니다.
 * @param attributeId 업데이트할 속성의 ID
 * @param newValue 새로운 값
 * @returns 업데이트된 속성 객체 또는 undefined (속성을 찾지 못한 경우)
 */
export async function updateAttributeValue(
  attributeId: string,
  newValue: unknown,
): Promise<Attribute | undefined> {
  const [result] = await db
    .update(attributes)
    .set({ value: newValue })
    .where(eq(attributes.id, attributeId))
    .returning()
  return result || undefined
}

/**
 * ID로 특정 속성을 삭제합니다.
 * @param attributeId 삭제할 속성의 ID
 * @returns 삭제 성공 여부 (true: 성공, false: 실패 또는 해당 속성 없음)
 */
export async function deleteAttributeById(attributeId: string): Promise<boolean> {
  const result = await db
    .delete(attributes)
    .where(eq(attributes.id, attributeId))
    .returning({ id: attributes.id }) // Drizzle에서 delete 후 영향 받은 row 확인을 위해 returning 사용
  return result.length > 0
}

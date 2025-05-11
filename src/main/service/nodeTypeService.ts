import { db } from '../db/connect.js'
import { nodeTypes, type NewNodeType, type NodeType } from '../db/schemas/nodeType.js'
import { eq } from 'drizzle-orm'

/**
 * 새로운 노드 유형을 생성합니다.
 * @param data 생성할 노드 유형의 데이터 (`id` 제외)
 * @returns 생성된 노드 유형 객체
 */
export const createNodeType = async (data: Omit<NewNodeType, 'id'>): Promise<NodeType> => {
  const [newNodeType] = await db.insert(nodeTypes).values(data).returning()
  return newNodeType
}

/**
 * 모든 노드 유형을 조회합니다.
 * @returns 모든 노드 유형 객체의 배열
 */
export const getAllNodeTypes = async (): Promise<NodeType[]> => {
  return await db.select().from(nodeTypes)
}

/**
 * ID로 특정 노드 유형을 조회합니다.
 * @param params 매개변수 객체
 * @param params.id 조회할 노드 유형의 ID
 * @returns 조회된 노드 유형 객체. 찾지 못한 경우 `undefined`.
 */
export const getNodeTypeById = async ({ id }: { id: string }): Promise<NodeType | undefined> => {
  const [nodeType] = await db.select().from(nodeTypes).where(eq(nodeTypes.id, id))
  return nodeType || undefined
}

/**
 * 특정 노드 유형 ID에 해당하는 정의된 속성 이름 목록을 조회합니다.
 * @param params 매개변수 객체
 * @param params.nodeTypeId 조회할 노드 유형의 ID
 * @returns 정의된 속성 이름의 배열. 노드 유형을 찾지 못한 경우 `undefined`.
 */
export const getDefinedAttributeNamesByNodeTypeId = async ({
  nodeTypeId,
}: {
  nodeTypeId: string
}): Promise<string[] | undefined> => {
  const nodeType = await getNodeTypeById({ id: nodeTypeId })
  if (nodeType) {
    return nodeType.definedAttributeNames
  }
  return undefined
}

/**
 * ID로 특정 노드 유형을 업데이트합니다.
 * @param params 매개변수 객체
 * @param params.id 업데이트할 노드 유형의 ID
 * @param params.data 업데이트할 노드 유형의 데이터 (`id` 제외, 부분적 업데이트 가능)
 * @returns 업데이트된 노드 유형 객체. 찾지 못한 경우 `undefined`.
 */
export const updateNodeType = async ({
  id,
  data,
}: {
  id: string
  data: Partial<Omit<NewNodeType, 'id'>>
}): Promise<NodeType | undefined> => {
  const [updatedNodeType] = await db
    .update(nodeTypes)
    .set(data)
    .where(eq(nodeTypes.id, id))
    .returning()
  return updatedNodeType || undefined
}

/**
 * ID로 특정 노드 유형을 삭제합니다.
 * @param params 매개변수 객체
 * @param params.id 삭제할 노드 유형의 ID
 * @returns 삭제 성공 시 `true`, 실패 시 `false`.
 */
export const deleteNodeTypeById = async ({ id }: { id: string }): Promise<boolean> => {
  const result = await db
    .delete(nodeTypes)
    .where(eq(nodeTypes.id, id))
    .returning({ deletedId: nodeTypes.id })
  return result.length > 0
}

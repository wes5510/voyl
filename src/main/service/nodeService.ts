import { db } from '../db/connect.js'
import { Node, nodes } from '../db/schemas/node.js' // NewNode 등 다른 타입은 일단 제외
import { eq } from 'drizzle-orm'
import { updateAttributeValue as updateAttributeValueInAttributeService } from './attributeService.js' // Alias로 import

/**
 * (내부용) ID로 특정 Node 객체 전체를 조회합니다.
 * @param params - 조회 파라미터
 * @param params.nodeId - 조회할 Node의 ID
 * @returns 조회된 Node 객체 또는 undefined (찾지 못한 경우)
 */
async function __getNodeById(params: { nodeId: string }): Promise<Node | undefined> {
  const nodeResult = await db
    .select({
      id: nodes.id,
      parentId: nodes.parentId,
      index: nodes.index,
      attributeIds: nodes.attributeIds,
      title: nodes.title,
      content: nodes.content,
      typeId: nodes.typeId,
    })
    .from(nodes)
    .where(eq(nodes.id, params.nodeId))
    .limit(1)

  return nodeResult[0] ?? undefined
}

/**
 * Node의 제목을 업데이트합니다.
 * @param params - 업데이트 파라미터
 * @param params.id - Node ID
 * @param params.title - 새로운 제목 (빈 문자열 허용)
 * @returns 업데이트된 Node 객체 또는 undefined (노드가 없거나 업데이트 실패 시)
 */
export async function updateNodeTitle(params: {
  id: string
  title: string
}): Promise<Node | undefined> {
  const updatedNode = await db
    .update(nodes)
    .set({ title: params.title })
    .where(eq(nodes.id, params.id))
    .returning()

  return updatedNode[0] ?? undefined
}

/**
 * ID로 특정 Node의 제목(title)만 조회합니다.
 * @param params - 조회 파라미터
 * @param params.id - 조회할 Node의 ID
 * @returns 조회된 Node의 제목 문자열, 또는 Node를 찾지 못하면 undefined
 */
export async function getNodeTitleById(params: { id: string }): Promise<string | undefined> {
  const result = await db
    .select({ title: nodes.title })
    .from(nodes)
    .where(eq(nodes.id, params.id))
    .limit(1)

  return result[0]?.title ?? undefined
}

/**
 * ID로 특정 Node의 부모 ID(parentId)만 조회합니다.
 * @param params - 조회 파라미터
 * @param params.id - 조회할 Node의 ID
 * @returns 조회된 Node의 parentId (string | null), 또는 Node를 찾지 못하면 undefined
 */
export async function getNodeParentIdById(params: { id: string }): Promise<string | undefined> {
  const result = await db
    .select({ parentId: nodes.parentId })
    .from(nodes)
    .where(eq(nodes.id, params.id))
    .limit(1)

  return result[0]?.parentId ?? undefined
}

/**
 * 특정 Node의 parentId 필드만 직접 업데이트합니다.
 * 주의: 이 함수는 Tree 구조의 일관성을 책임지지 않습니다.
 * 트리 구조 변경은 TreeService를 통해 수행되어야 합니다.
 * @param params - 파라미터
 * @param params.nodeId - parentId를 변경할 Node의 ID
 * @param params.newParentId - 새로운 부모 Node의 ID. undefined 또는 생략 시 부모 없음(null)으로 설정.
 * @returns 업데이트된 Node 객체. Node를 찾지 못했거나 업데이트 실패 시 undefined.
 */
export async function setNodeParent(params: {
  nodeId: string
  newParentId?: string
}): Promise<Node | undefined> {
  const result = await db
    .update(nodes)
    .set({ parentId: params.newParentId ?? null })
    .where(eq(nodes.id, params.nodeId))
    .returning()

  return result[0] ?? undefined
}

/**
 * ID로 특정 Node의 index 값만 조회합니다.
 * @param params - 조회 파라미터
 * @param params.id - 조회할 Node의 ID
 * @returns 조회된 Node의 index (string), 또는 Node를 찾지 못하면 undefined
 */
export async function getNodeIndexById(params: { id: string }): Promise<string | undefined> {
  const result = await db
    .select({ index: nodes.index })
    .from(nodes)
    .where(eq(nodes.id, params.id))
    .limit(1)

  return result[0]?.index ?? undefined
}

/**
 * 특정 Node의 index 필드만 직접 업데이트합니다.
 * 주의: 이 함수는 Tree 구조의 일관성을 책임지지 않으며,
 * index 값의 유효성(예: 형제 노드간 중복 또는 올바른 Lexicographical 순서)을 검사하지 않습니다.
 * index 값 생성 및 유효성 관리는 TreeService와 같은 상위 서비스에서 처리해야 합니다.
 * @param params - 파라미터
 * @param params.id - index를 변경할 Node의 ID
 * @param params.index - 새로운 index 값
 * @returns 업데이트된 Node 객체. Node를 찾지 못했거나 업데이트 실패 시 undefined.
 */
export async function setNodeIndex(params: {
  id: string
  index: string
}): Promise<Node | undefined> {
  const result = await db
    .update(nodes)
    .set({ index: params.index })
    .where(eq(nodes.id, params.id))
    .returning()

  return result[0] ?? undefined
}

/**
 * 특정 Node에 Attribute를 연결합니다. (attributeId를 attributeIds 배열에 추가)
 * 만약 Node를 찾을 수 없으면 undefined를 반환합니다.
 * 이미 attributeId가 배열에 존재하면 변경사항 없이 현재 Node 객체를 반환합니다.
 * 그렇지 않으면 attributeId를 추가하고 업데이트된 Node 객체를 반환합니다.
 * @param params - 파라미터
 * @param params.nodeId - Attribute를 연결할 Node의 ID
 * @param params.attributeId - 연결할 Attribute의 ID
 * @returns 작업 후 Node 객체 (추가되었거나, 이미 존재했거나) 또는 Node를 찾지 못하면 undefined.
 */
export async function linkAttributeToNode(params: {
  nodeId: string
  attributeId: string
}): Promise<Node | undefined> {
  const currentNode = await __getNodeById({ nodeId: params.nodeId })

  if (!currentNode) {
    return undefined
  }

  const currentAttributeIds = currentNode.attributeIds

  if (currentAttributeIds.includes(params.attributeId)) {
    return currentNode
  }

  const newAttributeIds = [...currentAttributeIds, params.attributeId]
  const updatedNodeResult = await db
    .update(nodes)
    .set({ attributeIds: newAttributeIds })
    .where(eq(nodes.id, params.nodeId))
    .returning()

  return updatedNodeResult[0] ?? undefined
}

/**
 * 특정 Node에서 Attribute 연결을 해제합니다. (attributeId를 attributeIds 배열에서 제거)
 * 만약 Node를 찾을 수 없으면 undefined를 반환합니다.
 * attributeId가 배열에 존재하지 않으면 변경사항 없이 현재 Node 객체를 반환합니다.
 * 그렇지 않으면 attributeId를 제거하고 업데이트된 Node 객체를 반환합니다.
 * @param params - 파라미터
 * @param params.nodeId - Attribute 연결을 해제할 Node의 ID
 * @param params.attributeId - 연결 해제할 Attribute의 ID
 * @returns 작업 후 Node 객체 (제거되었거나, 원래 없었거나) 또는 Node를 찾지 못하면 undefined.
 */
export async function unlinkAttributeFromNode(params: {
  nodeId: string
  attributeId: string
}): Promise<Node | undefined> {
  const currentNode = await __getNodeById({ nodeId: params.nodeId })

  if (!currentNode) {
    return undefined
  }

  const currentAttributeIds = currentNode.attributeIds

  if (!currentAttributeIds.includes(params.attributeId)) {
    return currentNode
  }

  const newAttributeIds = currentAttributeIds.filter((id) => id !== params.attributeId)

  const updatedNodeResult = await db
    .update(nodes)
    .set({ attributeIds: newAttributeIds })
    .where(eq(nodes.id, params.nodeId))
    .returning()

  return updatedNodeResult[0] ?? undefined
}

/**
 * 특정 Node에 연결된 Attribute의 값을 업데이트하도록 AttributeService에 요청합니다.
 * NodeService는 해당 Attribute가 Node에 연결되어 있는지 확인하는 역할만 수행합니다.
 * 실제 값 업데이트는 AttributeService에서 처리됩니다.
 *
 * @param params - 파라미터
 * @param params.nodeId - 대상 Node의 ID
 * @param params.attributeId - 값을 업데이트할 Attribute의 ID
 * @param params.value - Attribute의 새로운 값
 * @returns Node 객체 (Attribute가 Node에 연결되어 있고, AttributeService 호출 시도가 이루어진 경우),
 *          또는 Node를 찾지 못하거나, Attribute가 연결되어 있지 않거나, AttributeService에서 업데이트 실패 시 undefined.
 */
export async function updateAttributeValueForNode(params: {
  nodeId: string
  attributeId: string
  value: unknown
}): Promise<Node | undefined> {
  const currentNode = await __getNodeById({ nodeId: params.nodeId })

  if (!currentNode || !currentNode.attributeIds.includes(params.attributeId)) {
    return undefined
  }

  const updatedAttribute = await updateAttributeValueInAttributeService(
    params.attributeId,
    params.value,
  )

  return updatedAttribute ? currentNode : undefined
}

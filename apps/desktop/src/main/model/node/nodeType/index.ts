// TODO: db/nodeType 모듈이 삭제되어 임시 주석 처리
// import * as db from '../../../db/nodeType/index.js'

// export async function createNodeType(
//   data: Omit<{ name: string; definedAttributeNames: string[] }, 'id'>,
// ) {
//   return db.createNodeType(data)
// }

// export async function getAllNodeTypes() {
//   return db.getAllNodeTypes()
// }

// export async function getNodeTypeById({ id }: { id: string }) {
//   return db.getNodeTypeById({ id })
// }

// export async function getDefinedAttributeNamesByNodeTypeId({
//   nodeTypeId,
// }: {
//   nodeTypeId: string
// }) {
//   return db.getDefinedAttributeNamesByNodeTypeId({ nodeTypeId })
// }

// export async function updateNodeType({
//   id,
//   data,
// }: {
//   id: string
//   data: Partial<{ name: string; definedAttributeNames: string[] }>
// }) {
//   return db.updateNodeType({ id, data })
// }

// export async function deleteNodeTypeById({ id }: { id: string }) {
//   return db.deleteNodeTypeById({ id })
// }

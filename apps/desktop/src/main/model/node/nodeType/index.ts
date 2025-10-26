import * as db from '../../../db/nodeType/index.js'

async function createNodeType(
  data: Omit<{ name: string; definedAttributeNames: string[] }, 'id'>,
) {
  return db.createNodeType(data)
}

async function getAllNodeTypes() {
  return db.getAllNodeTypes()
}

async function getNodeTypeById({ id }: { id: string }) {
  return db.getNodeTypeById({ id })
}

async function getDefinedAttributeNamesByNodeTypeId({
  nodeTypeId,
}: {
  nodeTypeId: string
}) {
  return db.getDefinedAttributeNamesByNodeTypeId({ nodeTypeId })
}

async function updateNodeType({
  id,
  data,
}: {
  id: string
  data: Partial<{ name: string; definedAttributeNames: string[] }>
}) {
  return db.updateNodeType({ id, data })
}

async function deleteNodeTypeById({ id }: { id: string }) {
  return db.deleteNodeTypeById({ id })
}

const NodeTypeModel = {
  createNodeType,
  getAllNodeTypes,
  getNodeTypeById,
  getDefinedAttributeNamesByNodeTypeId,
  updateNodeType,
  deleteNodeTypeById,
}
export default NodeTypeModel

import * as db from '../../../db/attributes/index.js'

async function createAttribute(data: { name: string; value: unknown }) {
  return db.createAttribute(data)
}

async function getAttributeById(attributeId: string) {
  return db.getAttributeById(attributeId)
}

async function updateAttributeValue({
  id,
  value,
}: {
  id: string
  value: unknown
}) {
  return db.updateAttributeValue(id, value)
}

async function deleteAttributeById(attributeId: string) {
  return db.deleteAttributeById(attributeId)
}

const AttributeModel = {
  createAttribute,
  getAttributeById,
  updateAttributeValue,
  deleteAttributeById,
}

export default AttributeModel

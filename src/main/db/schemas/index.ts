import { attributes } from './attributes.js'

const tables = {
  attributes: attributes,
}

const relations = {}

export const schema = {
  ...tables,
  ...relations,
}

import { rule as importPathFormat } from './rules/import-path-format.mjs'
import pagesConfig from './configs/pages.mjs'

export default {
  rules: {
    'import-path-format': importPathFormat,
  },
  configs: {
    pages: pagesConfig,
  },
}

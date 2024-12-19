import { rule as dependencyDirection } from './rules/dependency-direction.mjs'
import { rule as importPathFormat } from './rules/import-path-format.mjs'
import { rule as componentLocation } from './rules/component-location.mjs'
import { rule as moduleTypeControl } from './rules/module-type-control.mjs'
import pagesConfig from './configs/pages.mjs'

export default {
  rules: {
    'dependency-direction': dependencyDirection,
    'import-path-format': importPathFormat,
    'component-location': componentLocation,
    'module-type-control': moduleTypeControl,
  },
  configs: {
    pages: pagesConfig,
  },
}

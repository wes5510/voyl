import { rule as importPathFormat } from './rules/import-path-format.mjs'
import { rule as featuresModelAccess } from './rules/features-model-access.mjs'
import { rule as featuresIsolation } from './rules/features-isolation.mjs'

export default {
  rules: {
    'import-path-format': importPathFormat,
    'features-model-access': featuresModelAccess,
    'features-isolation': featuresIsolation,
  },
}

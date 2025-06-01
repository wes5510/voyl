import sameLevelImport from './rules/same-level-import'
import restrictImportsToPattern from './rules/restrict-imports-to-pattern'

module.exports = {
  rules: {
    'same-level-import': sameLevelImport,
    'restrict-imports-to-pattern': restrictImportsToPattern,
  },
}

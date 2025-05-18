import sameLevelImport from './rules/same-level-import'
import commonIsolation from './rules/common-isolation'
import noCrossModelImports from './rules/no-cross-model-imports'
import noPagesImport from './rules/no-pages-import'
import modelStoreImportOnly from './rules/model-store-import-only'

module.exports = {
  rules: {
    'same-level-import': sameLevelImport,
    'common-isolation': commonIsolation,
    'no-cross-model-imports': noCrossModelImports,
    'no-pages-import': noPagesImport,
    'model-store-import-only': modelStoreImportOnly,
  },
}

/* eslint-disable @typescript-eslint/no-require-imports */
const sameHierarchyImport = require('./rules/same-hierarchy-import')
const commonIsolation = require('./rules/common-isolation')
const noCrossModelImports = require('./rules/no-cross-model-imports')
const noPagesImport = require('./rules/no-pages-import')
const modelStoreImportOnly = require('./rules/model-store-import-only')

module.exports = {
  rules: {
    'same-hierarchy-import': sameHierarchyImport,
    'common-isolation': commonIsolation,
    'no-cross-model-imports': noCrossModelImports,
    'no-pages-import': noPagesImport,
    'model-store-import-only': modelStoreImportOnly,
  },
}

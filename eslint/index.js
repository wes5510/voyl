/* eslint-disable @typescript-eslint/no-require-imports */
const sameHierarchyImport = require('./rules/same-hierarchy-import')
const commonIsolation = require('./rules/common-isolation')
const noCrossFeatureImports = require('./rules/no-cross-feature-imports')
const noPagesImport = require('./rules/no-pages-import')
const featureModelIndexImportOnly = require('./rules/feature-model-index-import-only')
const featureUiInterfaceOnly = require('./rules/feature-ui-interface-only')

module.exports = {
  rules: {
    'same-hierarchy-import': sameHierarchyImport,
    'common-isolation': commonIsolation,
    'no-cross-feature-imports': noCrossFeatureImports,
    'no-pages-import': noPagesImport,
    'feature-model-index-import-only': featureModelIndexImportOnly,
    'feature-ui-interface-only': featureUiInterfaceOnly,
  },
}

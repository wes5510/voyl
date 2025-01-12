const sameHierarchyImport = require('./rules/same-hierarchy-import')
const pagesFeatureAccess = require('./rules/pages-feature-access')
const featureModelAccess = require('./rules/feature-model-access')
const featureIsolation = require('./rules/feature-isolation')
const commonIsolation = require('./rules/common-isolation')

module.exports = {
  rules: {
    'same-hierarchy-import': sameHierarchyImport,
    'pages-feature-access': pagesFeatureAccess,
    'feature-model-access': featureModelAccess,
    'feature-isolation': featureIsolation,
    'common-isolation': commonIsolation,
  },
}

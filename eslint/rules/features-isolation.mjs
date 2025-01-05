const debug = (message, ...args) => {
  if (process.env.DEBUG) {
    console.log(`[features-isolation] ${message}`, ...args)
  }
}

/**
 * Extract feature name from file path
 */
const extractFeatureName = (filePath) => {
  const match = filePath.match(/\/features\/([^/]+)\//)
  return match ? match[1] : null
}

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature isolation in features directory',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFile = context.getFilename()

        debug('Processing import:', { importPath, currentFile })

        // Check features directory access
        if (!importPath.includes('/features/')) {
          return
        }

        const currentFeature = extractFeatureName(currentFile)
        const targetFeature = extractFeatureName(importPath)

        // Allow if it's the same feature
        if (currentFeature === targetFeature) {
          return
        }

        // Allow access to model/index.ts from pages
        const isPagesAccess = currentFile.includes('/pages/')
        const isModelIndex = importPath.endsWith('/model') || importPath.endsWith('/model/index')

        if (!(isPagesAccess && isModelIndex)) {
          context.report({
            node,
            message: 'Cannot access other features directly',
          })
        }
      },
    }
  },
}

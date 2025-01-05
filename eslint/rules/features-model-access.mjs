const debug = (message, ...args) => {
  if (process.env.DEBUG) {
    console.log(`[features-model-access] ${message}`, ...args)
  }
}

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce model directory access rules in features',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const currentFile = context.getFilename()

        debug('Processing import:', { importPath, currentFile })

        // Check model directory access
        if (!importPath.includes('/model/')) {
          return
        }

        const isModelInternalFile = currentFile.includes('/model/')
        const isIndexFile = importPath.endsWith('/model') || importPath.endsWith('/model/index')

        // Allow if it's a model internal file
        if (isModelInternalFile) {
          return
        }

        // External access is only allowed through model/index.ts
        if (!isIndexFile) {
          context.report({
            node,
            message: 'Can only access model through index.ts',
          })
        }
      },
    }
  },
}

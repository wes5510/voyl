export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce module type control in pages directory',
    },
    schema: [],
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename()
        if (!filename.includes('/pages/')) return

        const relativePath = filename.split('pages/')[1]

        if (relativePath.includes('/shared/components/')) {
          const hasBusinessLogic = node.body.some((n) => {
            if (n.type !== 'ImportDeclaration') return false
            const importPath = n.source.value
            return (
              importPath.includes('/model/') ||
              importPath.includes('/store/') ||
              importPath.includes('/service/')
            )
          })

          if (hasBusinessLogic) {
            context.report({
              node,
              message:
                'shared/components/ must contain only pure UI components without business logic',
            })
          }
        }

        if (filename.endsWith('page.tsx')) {
          const hasComplexLogic = node.body.some((n) => {
            if (n.type !== 'ImportDeclaration') return false
            const importPath = n.source.value
            return importPath.includes('/utils/') || importPath.includes('/service/')
          })

          if (hasComplexLogic) {
            context.report({
              node,
              message: 'page.tsx should focus only on routing and layout',
            })
          }
        }
      },
    }
  },
}

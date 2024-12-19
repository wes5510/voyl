export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce dependency direction in pages directory',
    },
    schema: [],
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        if (!importPath.includes('/pages/')) return

        const currentFile = context.getFilename()
        if (!currentFile.includes('/pages/')) return

        const relativePath = importPath.replace('@/pages/', '')
        const currentPath = currentFile.split('pages/')[1]

        if (currentPath.includes('/shared/')) {
          if (relativePath.includes('/components/') || relativePath.includes('/[')) {
            context.report({
              node,
              message: 'shared/ components can only import from same or upper level shared/',
            })
          }
        }

        if (currentPath.includes('/components/')) {
          if (!relativePath.startsWith('./') && !relativePath.includes('/shared/')) {
            context.report({
              node,
              message: 'components/ can only import from same level components/ or shared/',
            })
          }
        }

        if (currentPath.endsWith('page.tsx')) {
          const currentDir = path.dirname(currentPath)
          if (
            !relativePath.startsWith('./components/') &&
            !relativePath.includes('/shared/') &&
            !relativePath.startsWith(currentDir + '/')
          ) {
            context.report({
              node,
              message: 'page.tsx can only import from its components/, shared/, and child pages',
            })
          }
        }
      },
    }
  },
}

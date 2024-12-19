import path from 'path'

export const rule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce component location rules in pages directory',
    },
    schema: [],
  },

  create(context) {
    return {
      Program(node) {
        const filename = context.getFilename()
        if (!filename.includes('/pages/')) return

        const relativePath = filename.split('pages/')[1]
        const isComponent = node.body.some(
          (n) =>
            n.type === 'ExportDefaultDeclaration' &&
            n.declaration.type === 'FunctionDeclaration' &&
            n.declaration.id?.name.endsWith('Component'),
        )

        if (isComponent) {
          if (
            !relativePath.includes('/components/') &&
            !relativePath.includes('/shared/components/')
          ) {
            context.report({
              node,
              message: 'Components must be located under components/ or shared/components/',
            })
          }
        }

        if (path.basename(filename) === 'page.tsx') {
          const hasInvalidLocation =
            relativePath.includes('/components/') || relativePath.includes('/shared/')
          if (hasInvalidLocation) {
            context.report({
              node,
              message: 'page.tsx files must not be located under components/ or shared/',
            })
          }
        }
      },
    }
  },
}

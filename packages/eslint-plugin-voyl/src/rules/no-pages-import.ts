import { isNodeModulesImport, getAbsolutePath, isIgnoredPath } from '../utils/path'
import { isPagesPath } from '../utils/page'
import { Rule } from 'eslint'

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit imports from pages directory',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      noPageImport: "Cannot import from pages directory '{{importPath}}'.",
    },
    defaultOptions: [{ ignorePatterns: [] }],
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []
    const extensions = options.extensions ?? DEFAULT_EXTENSIONS

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (typeof importPath !== 'string') {
          return
        }

        if (isNodeModulesImport({ importPath })) {
          return
        }

        const absoluteImportPath = getAbsolutePath({
          filePath: importPath,
          context,
          extensions,
        })

        if (isIgnoredPath({ absolutePath: absoluteImportPath, ignorePatterns })) {
          return
        }

        if (isPagesPath({ absolutePath: absoluteImportPath })) {
          context.report({
            node,
            messageId: 'noPageImport',
            data: { importPath },
          })
        }
      },
    }
  },
}

export default rule

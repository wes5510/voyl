import { isNodeModulesImport, getAbsolutePath, isIgnoredPath } from '../utils/path'
import { isModelPath, isSameModel } from '../utils/model'
import { Rule } from 'eslint'

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit imports between different models',
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
      invalidModelAccess: "Cannot import from different model '{{importPath}}'.",
    },
    defaultOptions: [{ ignorePatterns: [] }],
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value
        const extensions = options.extensions ?? DEFAULT_EXTENSIONS

        if (typeof importPath !== 'string') {
          return
        }

        if (isNodeModulesImport({ importPath })) {
          return
        }

        const absoluteFilePath = getAbsolutePath({
          filePath: context.physicalFilename,
          context,
          extensions,
        })

        if (!isModelPath({ absolutePath: absoluteFilePath })) {
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

        if (
          isModelPath({ absolutePath: absoluteImportPath }) &&
          !isSameModel({ absoluteFilePath, absoluteImportPath })
        ) {
          context.report({
            node,
            messageId: 'invalidModelAccess',
            data: { importPath },
          })
        }
      },
    }
  },
}

export default rule

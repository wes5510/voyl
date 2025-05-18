import type { Rule } from 'eslint'
import { isNodeModulesImport, getAbsolutePath, isIgnoredPath } from '../utils/path'

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce common isolation rules',
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
      invalidAccess: "Common directory can only import from common directory '{{importPath}}'",
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const isCommonPath = ({ absolutePath }: { absolutePath: string }) => {
      return absolutePath.includes('/common/')
    }

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

        const absoluteImportPath = getAbsolutePath({
          filePath: importPath,
          context,
          extensions,
        })
        const absoluteFilePath = getAbsolutePath({
          filePath: context.physicalFilename,
          context,
          extensions,
        })

        if (!isCommonPath({ absolutePath: absoluteFilePath })) {
          return
        }

        if (isIgnoredPath({ absolutePath: absoluteImportPath, ignorePatterns })) {
          return
        }

        if (!isCommonPath({ absolutePath: absoluteImportPath })) {
          context.report({
            node,
            messageId: 'invalidAccess',
            data: { importPath },
          })
        }
      },
    }
  },
}

export default rule

import micromatch from 'micromatch'
import { isNodeModulesImport, getAbsolutePath, isIgnoredPath } from '../utils/path'
import { isModelPath } from '../utils/model'
import { Rule } from 'eslint'

const MODEL_ACCESS_PATTERNS = {
  STORE_FILE_ONLY: '**/models/*/store?(.@(ts))',
}
const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce model store access rules',
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
      invalidModelAccess:
        'Model can only be accessed through index file. Invalid import path: {{importPath}}',
    },
    defaultOptions: [{ ignorePatterns: [] }],
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const isValidModelAccess = ({ absolutePath }: { absolutePath: string }) => {
      return micromatch.isMatch(absolutePath, MODEL_ACCESS_PATTERNS.STORE_FILE_ONLY)
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

        if (isIgnoredPath({ absolutePath: absoluteImportPath, ignorePatterns })) {
          return
        }

        if (!isModelPath({ absolutePath: absoluteImportPath })) {
          return
        }

        if (!isValidModelAccess({ absolutePath: absoluteImportPath })) {
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

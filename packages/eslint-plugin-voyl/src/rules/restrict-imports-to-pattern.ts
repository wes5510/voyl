import type { Rule } from 'eslint'
import {
  isNodeModulesImport,
  getAbsolutePath,
  isMatchedPattern,
  getMatchedPattern,
} from '../utils/path'

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Restrict imports to specified patterns',
    },
    schema: [
      {
        type: 'object',
        properties: {
          patterns: {
            type: 'array',
            items: { type: 'string' },
          },
          tsconfigPath: { type: 'string' },
          extensions: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidImport: "Import path '{{importPath}}' is not allowed. Allowed patterns: {{patterns}}.",
    },
  },
  create(context) {
    const options = context.options[0] ?? {}
    const patterns = options.patterns ?? []
    const tsconfigPath = options.tsconfigPath
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
          tsconfigPath,
        })

        const isAllowed = patterns.some((pattern: string) =>
          isMatchedPattern({ absolutePath: absoluteImportPath, pattern }),
        )

        if (!isAllowed) {
          context.report({
            node,
            messageId: 'invalidImport',
            data: { importPath, patterns: patterns.join(', ') },
          })
        }
      },
    }
  },
}

export default rule

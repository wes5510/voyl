/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isPagesPath } = require('./utils/page')

module.exports = {
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
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (isNodeModulesImport(importPath)) {
          return
        }

        const absoluteImportPath = getAbsolutePath(importPath, context)

        if (isIgnoredPath(absoluteImportPath, ignorePatterns)) {
          return
        }

        if (isPagesPath(absoluteImportPath)) {
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

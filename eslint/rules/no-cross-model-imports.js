/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isModelPath, isSameModel } = require('./utils/model')

module.exports = {
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

        const absoluteFilePath = getAbsolutePath(context.physicalFilename, context)

        if (!isModelPath(absoluteFilePath)) {
          return
        }

        const absoluteImportPath = getAbsolutePath(importPath, context)

        if (isIgnoredPath(absoluteImportPath, ignorePatterns)) {
          return
        }

        if (isModelPath(absoluteImportPath) && !isSameModel(absoluteFilePath, absoluteImportPath)) {
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

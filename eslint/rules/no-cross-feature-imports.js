/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isFeaturePath, isSameFeature } = require('./utils/feature')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Prohibit imports between different feature modules',
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
      invalidFeatureAccess: "Cannot import from different feature module '{{importPath}}'.",
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

        if (!isFeaturePath(absoluteFilePath)) {
          return
        }

        const absoluteImportPath = getAbsolutePath(importPath, context)

        if (isIgnoredPath(absoluteImportPath, ignorePatterns)) {
          return
        }

        if (
          isFeaturePath(absoluteImportPath) &&
          !isSameFeature(absoluteFilePath, absoluteImportPath)
        ) {
          context.report({
            node,
            messageId: 'invalidFeatureAccess',
            data: { importPath },
          })
        }
      },
    }
  },
}

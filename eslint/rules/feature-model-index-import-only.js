/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const micromatch = require('micromatch')
const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isFeaturePath } = require('./utils/feature')

const MODEL_ACCESS_PATTERNS = {
  DIRECTORY_ONLY: '**/features/*/model',
  INDEX_FILE_ONLY: '**/features/*/model/index.?(.@(ts|tsx))',
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature model access rules',
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
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const isModelPath = (absolutePath) => {
      return absolutePath.includes('/model')
    }

    const isValidModelAccess = (absolutePath) => {
      return (
        micromatch.isMatch(absolutePath, MODEL_ACCESS_PATTERNS.DIRECTORY_ONLY) ||
        micromatch.isMatch(absolutePath, MODEL_ACCESS_PATTERNS.INDEX_FILE_ONLY)
      )
    }

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

        if (!isFeaturePath(absoluteImportPath) || !isModelPath(absoluteImportPath)) {
          return
        }

        if (!isValidModelAccess(absoluteImportPath)) {
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

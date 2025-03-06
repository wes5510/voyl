/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const micromatch = require('micromatch')
const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isModelPath } = require('./utils/model')

const MODEL_ACCESS_PATTERNS = {
  STORE_FILE_ONLY: '**/models/*/store?(.@(ts))',
}

module.exports = {
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
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const isValidModelAccess = (absolutePath) => {
      return micromatch.isMatch(absolutePath, MODEL_ACCESS_PATTERNS.STORE_FILE_ONLY)
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

        if (!isModelPath(absoluteImportPath)) {
          return
        }

        console.log({
          absoluteImportPath,
          'isValidModelAccess(absoluteImportPath)': isValidModelAccess(absoluteImportPath),
        })

        if (!isValidModelAccess(absoluteImportPath)) {
          console.log('invalidModelAccess')
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

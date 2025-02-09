/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const micromatch = require('micromatch')
const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')
const { isFeaturePath } = require('./utils/feature')

const UI_ACCESS_PATTERNS = {
  FIRST_LEVEL_FILES: '**/features/*/ui/*?(.@(ts|tsx))',
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce feature ui interface only',
    },
    schema: [
      {
        type: 'object',
        properties: {
          ignorePatterns: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      invalidUiAccess:
        'Only direct file access is allowed in ui directory. Invalid import path: {{importPath}}',
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const validateFeatureDirectoryAccess = (absolutePath, patterns) => {
      return patterns.some((pattern) => micromatch.isMatch(absolutePath, pattern))
    }

    const isUiDirectoryAccessValid = (absolutePath) => {
      const allowedPatterns = [UI_ACCESS_PATTERNS.FIRST_LEVEL_FILES]
      return validateFeatureDirectoryAccess(absolutePath, allowedPatterns)
    }

    const isUiPath = (absolutePath) => {
      return micromatch.isMatch(absolutePath, '**/features/*/ui/**')
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (isNodeModulesImport(importPath)) {
          return
        }

        const absolutePath = getAbsolutePath(importPath, context)

        if (isIgnoredPath(absolutePath, ignorePatterns)) {
          return
        }

        if (!isFeaturePath(absolutePath)) {
          return
        }

        if (!isUiPath(absolutePath)) {
          return
        }

        if (!isUiDirectoryAccessValid(absolutePath)) {
          context.report({
            node,
            messageId: 'invalidUiAccess',
            data: { importPath },
          })
        }
      },
    }
  },
}

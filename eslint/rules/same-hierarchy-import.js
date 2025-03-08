/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const path = require('path')
const { isNodeModulesImport, getAbsolutePath, isIgnoredPath } = require('./utils/path')

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'enforce same hierarchy imports',
      recommended: false,
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
      invalidImport: "Import path '{{importPath}}' is not in the same hierarchy.",
      invalidSharedImport: "Import path '{{importPath}}' is not a valid shared import.",
    },
  },
  create(context) {
    const options = context.options[0] || {}
    const ignorePatterns = options.ignorePatterns || []

    const isSharedImport = (absolutePath) => {
      return absolutePath.includes('/shared')
    }

    const hasDeepNesting = (absoluteImportPath) => {
      const sharedIndex = absoluteImportPath.indexOf('/shared/')
      if (sharedIndex === -1) return false

      const pathAfterShared = absoluteImportPath.slice(sharedIndex + '/shared/'.length)
      return pathAfterShared.includes('/')
    }

    const isValidHierarchy = (absoluteFilePath, absoluteImportPath) => {
      const fileDir = path.dirname(absoluteFilePath)
      const importDir = path.dirname(absoluteImportPath)

      const relativePath = path.relative(fileDir, importDir)
      const parts = relativePath.split(path.sep)

      return (
        parts[parts.length - 1] === 'shared' &&
        parts.every((part) => part === '..' || part === 'shared')
      )
    }

    const isValidSharedImport = (absoluteFilePath, absoluteImportPath) => {
      if (hasDeepNesting(absoluteImportPath)) {
        return false
      }

      return isValidHierarchy(absoluteFilePath, absoluteImportPath)
    }

    const isIndexFile = (absolutePath) => {
      const filename = path.basename(absolutePath)
      return filename.startsWith('index.')
    }

    const isValidIndexImport = (absoluteFilePath, absoluteImportPath) => {
      const importGrandParentDir = path.dirname(path.dirname(absoluteImportPath))
      const currentDir = path.dirname(absoluteFilePath)
      return importGrandParentDir === currentDir
    }

    const isSameDirectory = (absoluteFilePath, absoluteImportPath) => {
      return path.dirname(absoluteFilePath) === path.dirname(absoluteImportPath)
    }

    const isValidRegularImport = (absoluteFilePath, absoluteImportPath) => {
      if (isIndexFile(absoluteImportPath)) {
        return isValidIndexImport(absoluteFilePath, absoluteImportPath)
      }
      return isSameDirectory(absoluteFilePath, absoluteImportPath)
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (isNodeModulesImport(importPath)) {
          return
        }

        const absoluteImportPath = getAbsolutePath(importPath, context)
        const absoluteFilePath = getAbsolutePath(context.physicalFilename, context)

        if (isIgnoredPath(absoluteImportPath, ignorePatterns)) {
          return
        }

        if (isSharedImport(absoluteImportPath) && !isSharedImport(absoluteFilePath)) {
          if (!isValidSharedImport(absoluteFilePath, absoluteImportPath)) {
            context.report({
              node,
              messageId: 'invalidSharedImport',
              data: { importPath },
            })
          }
          return
        }

        if (!isValidRegularImport(absoluteFilePath, absoluteImportPath)) {
          context.report({
            node,
            messageId: 'invalidImport',
            data: { importPath },
          })
        }
      },
    }
  },
}

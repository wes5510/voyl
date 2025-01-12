'use strict'

const path = require('path')
const micromatch = require('micromatch')
const { loadConfig, createMatchPath } = require('tsconfig-paths')

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
    let matchPathCache = null

    const initMatchPatch = () => {
      const config = loadConfig()

      if (config.resultType === 'failed') {
        console.warn('Failed to load tsconfig:', config.message)
        return () => undefined
      }

      return createMatchPath(config.absoluteBaseUrl, config.paths)
    }

    const initTsConfigPathMatcher = () => {
      return matchPathCache || initMatchPatch()
    }

    const isAliasPath = (filePath) => {
      if (isRelativePath(filePath)) {
        return false
      }

      const matchPath = initTsConfigPathMatcher()
      return !!matchPath(filePath)
    }

    const getAliasAbsolutePath = (filePath) => {
      const matchPath = initTsConfigPathMatcher()
      return matchPath(filePath) || filePath
    }

    const getRelativeAbsolutePath = (filePath, context) => {
      const currentDir = path.dirname(context.physicalFilename)
      return path.resolve(currentDir, filePath)
    }

    const getAbsolutePath = (filePath, context) => {
      if (isAliasPath(filePath)) {
        return getAliasAbsolutePath(filePath)
      }

      if (isRelativePath(filePath)) {
        return getRelativeAbsolutePath(filePath, context)
      }

      return filePath
    }

    const isIgnoredPath = (absolutePath, ignorePatterns) => {
      return ignorePatterns.some((pattern) => micromatch.isMatch(absolutePath, pattern))
    }

    const isNodeModulesImport = (importPath) => {
      return (
        !importPath.startsWith('./') &&
        !importPath.startsWith('../') &&
        !importPath.startsWith('@/')
      )
    }

    const isRelativePath = (filePath) => {
      return filePath.startsWith('./') || filePath.startsWith('../')
    }

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

        if (isSharedImport(absoluteImportPath)) {
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

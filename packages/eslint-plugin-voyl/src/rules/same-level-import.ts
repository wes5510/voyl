import type { Rule } from 'eslint'
import path from 'node:path'

import {
  getAbsolutePath,
  getMatchedPattern,
  getRelativePathSegments,
  hasDirectoryInPath,
  isAbsolutePaths,
  isDirectChild,
  isIndexFile,
  isMatchedPattern,
  isSameDirectory,
} from '../utils/path'

const DEFAULT_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx']
const SHARED_DIR_NAME = 'shared'

const rule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Enforce same level imports',
      recommended: false,
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
      invalidImport: "Import path '{{importPath}}' is not in the same level.",
      invalidSharedImport: "Import path '{{importPath}}' is not a valid shared import.",
    },
  },
  create(context) {
    const options = context.options[0] ?? {}
    const patterns = options.patterns ?? []
    const tsconfigPath = options.tsconfigPath
    const extensions = options.extensions ?? DEFAULT_EXTENSIONS

    const isSharedImport = ({ absolutePath }: { absolutePath: string }) => {
      return hasDirectoryInPath({
        absolutePath,
        dirName: SHARED_DIR_NAME,
      })
    }

    const isValidSharedImport = ({
      absoluteFilePath,
      absoluteImportPath,
    }: {
      absoluteFilePath: string
      absoluteImportPath: string
    }) => {
      if (
        !isDirectChild({
          absolutePath: absoluteImportPath,
          baseDirName: SHARED_DIR_NAME,
        })
      ) {
        return false
      }

      return isValidSharedImportLevel({ absoluteFilePath, absoluteImportPath })
    }

    const isValidSharedImportLevel = ({
      absoluteFilePath,
      absoluteImportPath,
    }: {
      absoluteFilePath: string
      absoluteImportPath: string
    }) => {
      const segments = getRelativePathSegments({
        targetPath: path.dirname(absoluteImportPath),
        sourcePath: path.dirname(absoluteFilePath),
      })

      return (
        segments[segments.length - 1] === SHARED_DIR_NAME &&
        segments.every((part) => part === '..' || part === SHARED_DIR_NAME)
      )
    }

    const isValidRegularImport = ({
      absoluteFilePath,
      absoluteImportPath,
    }: {
      absoluteFilePath: string
      absoluteImportPath: string
    }) => {
      if (isIndexFile({ absolutePath: absoluteFilePath })) {
        return (
          isSameDirectory({
            absolutePath1: getPathWithoutIndexFile({
              absolutePath: absoluteFilePath,
            }),
            absolutePath2: absoluteImportPath,
          }) ||
          isSameDirectory({
            absolutePath1: absoluteFilePath,
            absolutePath2: getPathWithoutIndexFile({
              absolutePath: absoluteImportPath,
            }),
          }) ||
          (isIndexFile({ absolutePath: absoluteImportPath }) &&
            isSameDirectory({
              absolutePath1: getPathWithoutIndexFile({
                absolutePath: absoluteFilePath,
              }),
              absolutePath2: getPathWithoutIndexFile({
                absolutePath: absoluteImportPath,
              }),
            }))
        )
      }

      return (
        isSameDirectory({
          absolutePath1: absoluteFilePath,
          absolutePath2: getPathWithoutIndexFile({
            absolutePath: absoluteImportPath,
          }),
        }) ||
        isSameDirectory({
          absolutePath1: absoluteFilePath,
          absolutePath2: absoluteImportPath,
        })
      )
    }

    const getPathWithoutIndexFile = ({ absolutePath }: { absolutePath: string }) =>
      isIndexFile({ absolutePath }) ? path.dirname(absolutePath) : absolutePath

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value

        if (typeof importPath !== 'string') {
          return
        }

        const absoluteFilePath = getAbsolutePath({
          filePath: context.physicalFilename,
          context,
          extensions,
          tsconfigPath,
        })

        const matchedPattern = getMatchedPattern({
          absolutePath: absoluteFilePath,
          patterns,
        })

        if (!matchedPattern) {
          return
        }

        const absoluteImportPath = getAbsolutePath({
          filePath: importPath,
          context,
          extensions,
          tsconfigPath,
        })

        if (
          !isMatchedPattern({
            absolutePath: absoluteImportPath,
            pattern: matchedPattern,
          })
        ) {
          return
        }

        if (
          !isAbsolutePaths({
            paths: [absoluteFilePath, absoluteImportPath],
          })
        ) {
          return
        }

        if (
          isSharedImport({ absolutePath: absoluteImportPath }) &&
          !isSharedImport({
            absolutePath: absoluteFilePath,
          })
        ) {
          if (!isValidSharedImport({ absoluteFilePath, absoluteImportPath })) {
            context.report({
              node,
              messageId: 'invalidSharedImport',
              data: { importPath },
            })
          }

          return
        }

        if (!isValidRegularImport({ absoluteFilePath, absoluteImportPath })) {
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

export default rule

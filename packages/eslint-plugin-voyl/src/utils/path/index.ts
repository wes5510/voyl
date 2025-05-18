import type { Rule } from 'eslint'
import micromatch from 'micromatch'
import { loadConfig } from 'tsconfig-paths/lib/config-loader'
import { createMatchPath } from 'tsconfig-paths/lib/match-path-sync'
import path from 'node:path'
import { INDEX_FILE_NAME } from './const'

export const isMatchedPattern = ({
  absolutePath,
  pattern,
}: {
  absolutePath: string
  pattern: string
}) => {
  return micromatch.isMatch(absolutePath, pattern)
}

export const getMatchedPattern = ({
  absolutePath,
  patterns,
}: {
  absolutePath: string
  patterns: string[]
}) => {
  return patterns.find((pattern) => micromatch.isMatch(absolutePath, pattern))
}

export const getAbsolutePath = ({
  filePath,
  context,
  extensions,
}: {
  filePath: string
  context: Rule.RuleContext
  extensions: string[]
}) => {
  if (isAliasPath({ filePath, extensions })) {
    return getAliasAbsolutePath({ filePath, extensions })
  }

  if (isRelativePath({ filePath })) {
    return getRelativeAbsolutePath({ filePath, context })
  }

  return path.normalize(filePath)
}

let matchPathCache: ReturnType<typeof createMatchPath> | undefined = undefined

const isAliasPath = ({ filePath, extensions }: { filePath: string; extensions: string[] }) => {
  if (isRelativePath({ filePath })) {
    return false
  }

  const matchPath = matchPathCache || (matchPathCache = initMatchPath())

  return !!matchPath(filePath, undefined, undefined, extensions)
}

const initMatchPath = () => {
  const config = loadConfig()

  if (config.resultType === 'failed') {
    console.warn('Failed to load tsconfig:', config.message)
    return () => undefined
  }

  return createMatchPath(config.absoluteBaseUrl, config.paths)
}

const isRelativePath = ({ filePath }: { filePath: string }) => {
  return filePath.startsWith('./') || filePath.startsWith('../')
}

const getAliasAbsolutePath = ({
  filePath,
  extensions,
}: {
  filePath: string
  extensions: string[]
}) => {
  const matchPath = matchPathCache || (matchPathCache = initMatchPath())
  return matchPath(filePath, undefined, undefined, extensions) || filePath
}

const getRelativeAbsolutePath = ({
  filePath,
  context,
}: {
  filePath: string
  context: Rule.RuleContext
}) => {
  const currentDir = path.dirname(context.getPhysicalFilename())
  return path.resolve(currentDir, filePath)
}

export const isDirectChild = ({
  absolutePath,
  baseDirName,
}: {
  absolutePath: string
  baseDirName: string
}): boolean => {
  const parentDir = path.dirname(absolutePath)
  const parentDirName = path.basename(parentDir)
  return parentDirName === baseDirName
}

export const hasDirectoryInPath = ({
  absolutePath,
  dirName,
}: {
  absolutePath: string
  dirName: string
}): boolean => {
  return getSegments({ absolutePath }).includes(dirName)
}

const getSegments = ({ absolutePath }: { absolutePath: string }) => {
  return absolutePath.split(path.sep)
}

export const isIndexFile = ({ absolutePath }: { absolutePath: string }): boolean => {
  const filename = path.basename(absolutePath)
  return filename.startsWith(INDEX_FILE_NAME)
}

export const isSameDirectory = ({
  absolutePath1,
  absolutePath2,
}: {
  absolutePath1: string
  absolutePath2: string
}) => {
  return path.dirname(absolutePath1) === path.dirname(absolutePath2)
}

export const getRelativePathSegments = ({
  targetPath,
  sourcePath,
}: {
  targetPath: string
  sourcePath: string
}) => {
  return getSegments({ absolutePath: path.relative(sourcePath, targetPath) })
}

export const isAbsolutePaths = ({ paths }: { paths: string[] }): boolean => {
  return paths.every((__path) => path.isAbsolute(__path))
}

export const isNodeModulesImport = ({ importPath }: { importPath: string }) => {
  return (
    !importPath.startsWith('./') && !importPath.startsWith('../') && !importPath.startsWith('@/')
  )
}

export const isIgnoredPath = ({
  absolutePath,
  ignorePatterns,
}: {
  absolutePath: string
  ignorePatterns: string[]
}) => {
  return ignorePatterns.some((pattern) => micromatch.isMatch(absolutePath, pattern))
}

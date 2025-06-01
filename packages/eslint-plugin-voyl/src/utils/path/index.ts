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
  tsconfigPath,
}: {
  filePath: string
  context: Rule.RuleContext
  extensions: string[]
  tsconfigPath: string
}) => {
  if (isAliasPath({ filePath, extensions, tsconfigPath })) {
    return getAliasAbsolutePath({ filePath, extensions, tsconfigPath })
  }

  if (isRelativePath({ filePath })) {
    return getRelativeAbsolutePath({ filePath, context })
  }

  return path.normalize(filePath)
}

const matchPathCache: Map<string, ReturnType<typeof createMatchPath>> = new Map()

const isAliasPath = ({
  filePath,
  extensions,
  tsconfigPath,
}: {
  filePath: string
  extensions: string[]
  tsconfigPath: string
}) => {
  if (isRelativePath({ filePath })) {
    return false
  }

  const matchPath = getMatchPath({ tsconfigPath })
  return !!matchPath(filePath, undefined, undefined, extensions)
}

const getMatchPath = ({ tsconfigPath }: { tsconfigPath: string }) => {
  if (matchPathCache.has(tsconfigPath)) {
    return matchPathCache.get(tsconfigPath)!
  }

  const config = loadConfig(tsconfigPath)

  if (config.resultType === 'failed') {
    console.warn('Failed to load tsconfig:', config.message)
    const emptyMatchPath = () => undefined
    matchPathCache.set(tsconfigPath, emptyMatchPath)
    return emptyMatchPath
  }

  const matchPath = createMatchPath(config.absoluteBaseUrl, config.paths)
  matchPathCache.set(tsconfigPath, matchPath)
  return matchPath
}

const isRelativePath = ({ filePath }: { filePath: string }) => {
  return filePath.startsWith('./') || filePath.startsWith('../')
}

const getAliasAbsolutePath = ({
  filePath,
  extensions,
  tsconfigPath,
}: {
  filePath: string
  extensions: string[]
  tsconfigPath: string
}) => {
  const matchPath = getMatchPath({ tsconfigPath })
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
  const extension = path.extname(filename)

  return filename === `${INDEX_FILE_NAME}${extension}`
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

/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const path = require('node:path')
const micromatch = require('micromatch')
const { loadConfig, createMatchPath } = require('tsconfig-paths')

let matchPathCache = null

const initMatchPath = () => {
  const config = loadConfig()

  if (config.resultType === 'failed') {
    console.warn('Failed to load tsconfig:', config.message)
    return () => undefined
  }

  return createMatchPath(config.absoluteBaseUrl, config.paths)
}

const isIgnoredPath = (absolutePath, ignorePatterns) => {
  return ignorePatterns.some((pattern) => micromatch.isMatch(absolutePath, pattern))
}

const isNodeModulesImport = (importPath) => {
  return (
    !importPath.startsWith('./') && !importPath.startsWith('../') && !importPath.startsWith('@/')
  )
}

const isRelativePath = (filePath) => {
  return filePath.startsWith('./') || filePath.startsWith('../')
}

const isAliasPath = (filePath) => {
  if (isRelativePath(filePath)) {
    return false
  }

  const matchPath = matchPathCache || (matchPathCache = initMatchPath())
  return !!matchPath(filePath)
}

const getAliasAbsolutePath = (filePath) => {
  const matchPath = matchPathCache || (matchPathCache = initMatchPath())
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

module.exports = {
  initMatchPath,
  isIgnoredPath,
  isNodeModulesImport,
  isAliasPath,
  getAliasAbsolutePath,
  getRelativeAbsolutePath,
  isRelativePath,
  getAbsolutePath,
}

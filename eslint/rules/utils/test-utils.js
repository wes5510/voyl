/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mock } = require('node:test')
const path = require('node:path')
const configLoader = require('tsconfig-paths/lib/config-loader')
const matchPathSync = require('tsconfig-paths/lib/match-path-sync')
const { RuleTester } = require('eslint')

// Mock tsconfig paths
const mockTsConfigPaths = () => {
  mock.method(configLoader, 'loadConfig', () => ({
    resultType: 'success',
    absoluteBaseUrl: '/project/src',
    paths: {
      '@/models/*': ['models/*'],
      '@/common/*': ['common/*'],
      '@/pages/*': ['pages/*'],
    },
  }))

  mock.method(matchPathSync, 'createMatchPath', (absoluteBaseUrl, paths) => {
    const pathEntries = Object.entries(paths)

    return (requestedModule) => {
      for (const [pattern, [target]] of pathEntries) {
        const [prefix, suffix = ''] = pattern.split('*')
        if (requestedModule.startsWith(prefix) && requestedModule.endsWith(suffix)) {
          const matchedPart = requestedModule.slice(prefix.length, -suffix.length || undefined)
          const resolvedPath = target.replace('*', matchedPart)
          return path.join(absoluteBaseUrl, resolvedPath)
        }
      }
      return undefined
    }
  })
}

// Create RuleTester instance
const createRuleTester = () => {
  return new RuleTester({
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
    },
  })
}

module.exports = {
  mockTsConfigPaths,
  createRuleTester,
}

import { vi } from 'vitest'
import path from 'node:path'
import configLoader from 'tsconfig-paths/lib/config-loader'
import matchPathSync from 'tsconfig-paths/lib/match-path-sync'
import { RuleTester } from '@typescript-eslint/rule-tester'

export const mockTsConfigPaths = () => {
  vi.spyOn(configLoader, 'loadConfig').mockImplementation(() => ({
    resultType: 'success',
    configFileAbsolutePath: '/project/tsconfig.json',
    absoluteBaseUrl: '/project/src',
    paths: {
      '@/models/*': ['models/*'],
      '@/common/*': ['common/*'],
      '@/pages/*': ['pages/*'],
    },
  }))

  vi.spyOn(matchPathSync, 'createMatchPath').mockImplementation((absoluteBaseUrl, paths) => {
    const pathEntries = Object.entries(paths)

    return (requestedModule) => {
      for (const [pattern, targets] of pathEntries) {
        const target = Array.isArray(targets) ? targets[0] : targets
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

export const createRuleTester = () => {
  return new RuleTester({
    languageOptions: {
      ecmaVersion: 2015,
      sourceType: 'module',
    },
  })
}

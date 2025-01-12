'use strict'

const { mock } = require('node:test')
const path = require('node:path')
const configLoader = require('tsconfig-paths/lib/config-loader')
const matchPathSync = require('tsconfig-paths/lib/match-path-sync')

mock.method(configLoader, 'loadConfig', () => ({
  resultType: 'success',
  absoluteBaseUrl: '/src/renderer/src',
  paths: {
    '@/features/*': ['features/*'],
    '@/common/*': ['common/*'],
    '@/pages/*': ['pages/*'],
    '@/styled-system/*': ['styled-system/*'],
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

const rule = require('./same-hierarchy-import')
const RuleTester = require('eslint').RuleTester

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2015,
    sourceType: 'module',
  },
})

ruleTester.run('same-hierarchy-import', rule, {
  valid: [
    // 1. 같은 디렉토리 내 import
    {
      code: 'import { Something } from "./Something"',
      filename: '/src/renderer/src/pages/index.ts',
    },
    {
      code: 'import { Something } from "@/pages/Something"',
      filename: '/src/renderer/src/pages/index.ts',
    },

    // 2. shared 디렉토리 접근
    {
      code: 'import { Something } from "./shared/Button"',
      filename: '/src/renderer/src/pages/index.ts',
    },
    {
      code: 'import { Something } from "../shared/Button"',
      filename: '/src/renderer/src/pages/something/index.ts',
    },
    {
      code: 'import { Something } from "../../shared/Button"',
      filename: '/src/renderer/src/pages/deep/something/index.ts',
    },

    // 3. node_modules import
    {
      code: 'import { Something } from "some-package"',
      filename: '/src/renderer/src/pages/index.ts',
    },

    // 4. 무시할 패턴
    {
      code: 'import { Something } from "@/styled-system/Button"',
      filename: '/src/renderer/src/pages/index.ts',
      options: [{ ignorePatterns: ['**/styled-system/**'] }],
    },
  ],

  invalid: [
    // 1. 깊은 중첩 경로 (shared 제외)
    {
      code: 'import { Something } from "./deep/Something"',
      filename: '/src/renderer/src/pages/index.ts',
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      code: 'import { Something } from "@/pages/deep/Something"',
      filename: '/src/renderer/src/pages/index.ts',
      errors: [{ messageId: 'invalidImport' }],
    },

    // 2. shared 디렉토리 이후 깊은 중첩
    {
      code: 'import { Something } from "./shared/deep/Button"',
      filename: '/src/renderer/src/pages/index.ts',
      errors: [{ messageId: 'invalidSharedImport' }],
    },
    {
      code: 'import { Something } from "../shared/deep/Button"',
      filename: '/src/renderer/src/pages/something/index.ts',
      errors: [{ messageId: 'invalidSharedImport' }],
    },
  ],
})

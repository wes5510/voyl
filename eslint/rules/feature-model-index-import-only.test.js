/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./feature-model-index-import-only')
const ruleTester = createRuleTester()

ruleTester.run('feature-model-index-import-only', rule, {
  valid: [
    {
      code: 'import { useStore } from "@/features/tree/model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
    {
      code: 'import { useStore } from "../model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
    {
      code: 'import React from "react"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
    {
      code: 'import { util } from "@/features/tree/model/internal"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      options: [{ ignorePatterns: ['**/model/internal'] }],
    },
    {
      code: 'import { otherStore } from "@/features/other/model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
  ],

  invalid: [
    {
      code: 'import { store } from "@/features/tree/model/store"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/features/tree/model/store' },
        },
      ],
    },
    {
      code: 'import { util } from "../model/utils"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '../model/utils' },
        },
      ],
    },
    {
      code: 'import { useStore } from "@/features/tree/model/index"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/features/tree/model/index' },
        },
      ],
    },
    {
      code: 'import { deepUtil } from "@/features/tree/model/deep/module"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/features/tree/model/deep/module' },
        },
      ],
    },
  ],
})

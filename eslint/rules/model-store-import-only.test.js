/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./model-store-import-only')
const ruleTester = createRuleTester()

ruleTester.run('model-store-import-only', rule, {
  valid: [
    {
      code: 'import { useStore } from "@/models/tree/store"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
    },
    {
      code: 'import { useStore } from "../models/tree/store"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
    },
    {
      code: 'import { util } from "@/models/tree/store/internal"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
      options: [{ ignorePatterns: ['**/store/internal'] }],
    },
    {
      code: 'import { otherStore } from "@/models/other/store"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
    },
  ],

  invalid: [
    {
      code: 'import { store } from "@/models/tree"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/tree' },
        },
      ],
    },
    {
      code: 'import { util } from "../../models/tree/utils"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '../../models/tree/utils' },
        },
      ],
    },
    {
      code: 'import { useStore } from "@/models/tree/node"',
      filename: '/src/renderer/src/pages/nodes/page.tsx',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/tree/node' },
        },
      ],
    },
  ],
})

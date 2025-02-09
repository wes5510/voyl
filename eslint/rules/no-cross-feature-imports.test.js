/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./no-cross-feature-imports')
const ruleTester = createRuleTester()

ruleTester.run('no-cross-feature-imports', rule, {
  valid: [
    // 1. Import from same feature - absolute path
    {
      code: 'import { useStore } from "@/features/tree/model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
    {
      code: 'import { TreeView } from "@/features/tree/ui/TreeView"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },

    // 2. Import from same feature - relative path
    {
      code: 'import { useStore } from "../model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },
    {
      code: 'import { TreeView } from "./TreeView"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },

    // 3. Import from node_modules
    {
      code: 'import React from "react"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
    },

    // 4. Import from ignored patterns
    {
      code: 'import { Something } from "@/features/other/ui"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      options: [{ ignorePatterns: ['**/features/other/**'] }],
    },

    // 5. Import from non-feature file
    {
      code: 'import { useStore } from "@/features/tree/model"',
      filename: '/src/renderer/src/pages/index.tsx',
    },
  ],

  invalid: [
    // 1. Import from different feature model - absolute path
    {
      code: 'import { useStore } from "@/features/path/model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidFeatureAccess',
          data: { importPath: '@/features/path/model' },
        },
      ],
    },

    // 2. Import from different feature ui - absolute path
    {
      code: 'import { PathView } from "@/features/path/ui"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidFeatureAccess',
          data: { importPath: '@/features/path/ui' },
        },
      ],
    },

    // 3. Import from different feature - relative path
    {
      code: 'import { useStore } from "../../path/model"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidFeatureAccess',
          data: { importPath: '../../path/model' },
        },
      ],
    },

    // 4. Import from different feature component - relative path
    {
      code: 'import { PathView } from "../../path/ui/PathView"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidFeatureAccess',
          data: { importPath: '../../path/ui/PathView' },
        },
      ],
    },

    // 5. Import from deep path in different feature
    {
      code: 'import { util } from "@/features/path/ui/deep/util"',
      filename: '/src/renderer/src/features/tree/ui/Component.tsx',
      errors: [
        {
          messageId: 'invalidFeatureAccess',
          data: { importPath: '@/features/path/ui/deep/util' },
        },
      ],
    },
  ],
})

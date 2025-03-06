/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./no-cross-model-imports')
const ruleTester = createRuleTester()

ruleTester.run('no-cross-model-imports', rule, {
  valid: [
    // 1. Import from same model - absolute path
    {
      code: 'import { getNode } from "@/models/tree"',
      filename: '/src/renderer/src/models/tree/node',
    },
    {
      code: 'import { getNodeByIndex } from "@/models/tree/nodeTable"',
      filename: '/src/renderer/src/models/tree/store.ts',
    },

    // 2. Import from same model - relative path
    {
      code: 'import { getNode } from "../node"',
      filename: '/src/renderer/src/models/tree/nodeTable',
    },
    {
      code: 'import { getNodeByIndex } from "./nodeTable"',
      filename: '/src/renderer/src/models/tree/store.ts',
    },

    // 3. Import from node_modules
    {
      code: 'import React from "react"',
      filename: '/src/renderer/src/models/tree/nodeTable/index.ts',
    },

    // 4. Import from ignored patterns
    {
      code: 'import { Something } from "@/models/other"',
      filename: '/src/renderer/src/models/tree/nodeTable/index.ts',
      options: [{ ignorePatterns: ['**/models/other/**'] }],
    },

    // 5. Import from non-model file
    {
      code: 'import { useStore } from "@/models/tree"',
      filename: '/src/renderer/src/pages/index.tsx',
    },
  ],

  invalid: [
    // 1. Import from different model - absolute path
    {
      code: 'import { useStore } from "@/models/path"',
      filename: '/src/renderer/src/models/tree/nodeTable/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/path' },
        },
      ],
    },

    // 3. Import from different model - relative path
    {
      code: 'import { getNodeByIndex } from "../../path/model"',
      filename: '/src/renderer/src/models/tree/nodeTable/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '../../path/model' },
        },
      ],
    },

    // 4. Import from different model component - relative path
    {
      code: 'import { PathView } from "../../path/point"',
      filename: '/src/renderer/src/models/tree/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '../../path/point' },
        },
      ],
    },

    // 5. Import from deep path in different model
    {
      code: 'import { util } from "@/models/path/point"',
      filename: '/src/renderer/src/models/tree/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/path/point' },
        },
      ],
    },
  ],
})

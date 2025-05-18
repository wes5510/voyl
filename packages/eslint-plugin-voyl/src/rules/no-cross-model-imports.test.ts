import { mockTsConfigPaths, createRuleTester } from '../utils/test-utils'

mockTsConfigPaths()

import rule from './no-cross-model-imports'
const ruleTester = createRuleTester()

// @ts-expect-error
ruleTester.run('no-cross-model-imports', rule, {
  valid: [
    // 1. Import from same model - absolute path
    {
      code: 'import { getNode } from "@/models/tree"',
      filename: '/project/src/models/tree/node/index.ts',
    },
    {
      code: 'import { getNodeByIndex } from "@/models/tree/nodeTable"',
      filename: '/project/src/models/tree/store.ts',
    },

    // 2. Import from same model - relative path
    {
      code: 'import { getNode } from "../node"',
      filename: '/project/src/models/tree/nodeTable/index.ts',
    },
    {
      code: 'import { getNodeByIndex } from "./nodeTable"',
      filename: '/project/src/models/tree/store.ts',
    },

    // 3. Import from node_modules
    {
      code: 'import React from "react"',
      filename: '/project/src/models/tree/nodeTable/index.ts',
    },

    // 4. Import from ignored patterns
    {
      code: 'import { Something } from "@/models/other"',
      filename: '/project/src/models/tree/nodeTable/index.ts',
      options: [{ ignorePatterns: ['**/models/other/**'] }],
    },

    // 5. Import from non-model file
    {
      code: 'import { useStore } from "@/models/tree"',
      filename: '/project/src/pages/index.tsx',
    },
  ],

  invalid: [
    // 1. Import from different model - absolute path
    {
      code: 'import { useStore } from "@/models/path"',
      filename: '/project/src/models/tree/nodeTable/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/path' },
        },
      ],
    },

    // 2. Import from different model - relative path
    {
      code: 'import { getNodeByIndex } from "../../path"',
      filename: '/project/src/models/tree/nodeTable/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '../../path' },
        },
      ],
    },

    // 3. Import from deep path in different model
    {
      code: 'import { util } from "@/models/path/point"',
      filename: '/project/src/models/tree/index.ts',
      errors: [
        {
          messageId: 'invalidModelAccess',
          data: { importPath: '@/models/path/point' },
        },
      ],
    },
  ],
})

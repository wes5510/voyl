/* eslint-disable @typescript-eslint/no-require-imports */
'use strict'

const { mockTsConfigPaths, createRuleTester } = require('./utils/test-utils')

// Mock tsconfig paths
mockTsConfigPaths()

const rule = require('./same-hierarchy-import')
const ruleTester = createRuleTester()

ruleTester.run('same-hierarchy-import', rule, {
  valid: [
    // 1. Import from same directory
    {
      code: 'import { Something } from "./Something"',
      filename: '/project/src/pages/index.ts',
    },
    {
      code: 'import { Something } from "@/pages/Something"',
      filename: '/project/src/pages/index.ts',
    },

    // 2. Import from shared directory
    {
      code: 'import { Something } from "./shared/Button"',
      filename: '/project/src/pages/index.ts',
    },
    {
      code: 'import { Something } from "../shared/Button"',
      filename: '/project/src/pages/something/index.ts',
    },
    {
      code: 'import { Something } from "../../shared/Button"',
      filename: '/project/src/pages/deep/something/index.ts',
    },
    {
      code: 'import Icon from "./Icon"',
      filename: '/project/src/pages/shared/Button.tsx',
    },

    // 3. Import from node_modules
    {
      code: 'import { Something } from "some-package"',
      filename: '/project/src/pages/index.ts',
    },

    // 4. Import from ignored patterns
    {
      code: 'import { Something } from "@/styled-system/Button"',
      filename: '/project/src/pages/index.ts',
      options: [{ ignorePatterns: ['**/styled-system/**'] }],
    },
  ],

  invalid: [
    // 1. Import from deep nested path (except shared)
    {
      code: 'import { Something } from "./deep/Something"',
      filename: '/project/src/pages/index.ts',
      errors: [{ messageId: 'invalidImport' }],
    },
    {
      code: 'import { Something } from "@/pages/deep/Something"',
      filename: '/project/src/pages/index.ts',
      errors: [{ messageId: 'invalidImport' }],
    },

    // 2. Import from deep nested path in shared directory
    {
      code: 'import { Something } from "./shared/deep/Button"',
      filename: '/project/src/pages/index.ts',
      errors: [{ messageId: 'invalidSharedImport' }],
    },
    {
      code: 'import { Something } from "../shared/deep/Button"',
      filename: '/project/src/pages/something/index.ts',
      errors: [{ messageId: 'invalidSharedImport' }],
    },
  ],
})
